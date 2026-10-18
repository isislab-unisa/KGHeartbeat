"""Normalize catalogue descriptions to readable, single-line plain text."""

import re
import unicodedata
from html import unescape
from html.parser import HTMLParser


class _DescriptionParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.hidden = 0

    def handle_starttag(self, tag, attrs):
        if tag in {'script', 'style'}:
            self.hidden += 1
        if not self.hidden and tag in {'br', 'p', 'div', 'li', 'hr', 'blockquote'}:
            self.parts.append('\n')

    def handle_endtag(self, tag):
        if tag in {'script', 'style'}:
            self.hidden = max(0, self.hidden - 1)
        elif not self.hidden and tag in {'p', 'div', 'li', 'blockquote'}:
            self.parts.append('\n')

    def handle_data(self, data):
        if not self.hidden:
            self.parts.append(data)


def clean_description(value):
    """Remove escaped whitespace, HTML/Markdown and invisible control characters.

    Preserve Unicode letters, meaningful punctuation, and non-string missing
    values. Avoid unicode_escape decoding, which can corrupt multilingual text.
    """
    if not isinstance(value, str):
        return value

    text = re.sub(r'\\[nrt]', '\n', value)
    text = re.sub(r'''\\([\\'"`*_{}\[\]()#+.!>\-])''', r'\1', text)
    parser = _DescriptionParser()
    parser.feed(text)
    parser.close()
    text = unescape(''.join(parser.parts))
    # Keep link labels (and image alternative text), without Markdown targets.
    text = re.sub(r'!?\[([^\]]+)\]\([^\s)]*(?:\s+"[^"]*")?\)', r'\1', text)
    text = re.sub(r'(?m)^\s{0,3}(?:#{1,6}\s+|>\s*|[-+*]\s+)', '', text)
    text = re.sub(r'(?m)^\s*(?:`{3,}|~{3,})[^\n]*$', '', text)
    text = re.sub(r'(?<!\w)(`+|\*{1,3}|_{1,3})(\S(?:.*?\S)?)\1(?!\w)', r'\2', text)
    text = ''.join(
        ' ' if char.isspace() or char == '\u200b' else
        '' if unicodedata.category(char) in {'Cc', 'Cf', 'Cs'} else char
        for char in text
    )
    return ' '.join(unicodedata.normalize('NFC', text).split())
