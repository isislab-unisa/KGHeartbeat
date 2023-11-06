import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/Row';
import RangeSlider from 'react-bootstrap-range-slider';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

function Slider( { onSliderSet, default_value, label,id}) {
    return (
      <Form>
        <Form.Group as={Row}>
          <Col sm="8">
            <Form.Label>
              {label}
          </Form.Label>
            <RangeSlider
              value={default_value}
              step={1}
              min={1}
              max={5}
              onChange={e => onSliderSet(e.target.value,id)}
            />
          </Col>
          <Col sm="3">
            <Form.Control value={default_value}/>
          </Col>
        </Form.Group>
      </Form>
    );
};

export default Slider;