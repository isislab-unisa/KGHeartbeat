---
title: Quality score
---

Once we have calculated all the different quality values of the metrics, we are faced with a lot of quality data fragmented into the different 20 dimensions. This is useful for those who want to understand in depth the quality of the KG and where it is lacking, but it can be confusing for the user who wants to immediately understand if a KG is qualitatively better than another. For this reason, the calculation of the quality score was introduced, which solves precisely this type of problem. The same formula used by the [Luzzu framework](https://ceur-ws.org/Vol-1486/paper_74.pdf) to perform the KG ranking was adopted. In particular, the formula called $Weighted dimension value$ was adopted. It essentially allows us to have a single value for each quality dimension, condensing all the different values that make up each single dimension into a single piece of data. The formula used is the following.

$$
V(D,\theta) = \frac{\sum_{m\in D} v(m,\theta)}{\#D} = \theta{\frac{\sum_{m\in D} v(m,\theta) }{\#D}} 
$$

Where D is the quality dimension, $\theta$ is a weight which can be freely chosen (by default is 1) and $v(m)$ is the value assumed by the metric $m$ in the dimension $D$. Once we have obtained all the values for the individual dimensions, we perform a sum, in order to obtain a unique value. Finally we perform a normalization to obtain values between 0 and 100.