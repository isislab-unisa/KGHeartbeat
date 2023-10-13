---
title: Accessibility category
---

For the calculation of the following two metrics we will need the SPARQL endpoint to be present and active see how [here](./availability#sparql-endpoint).
## Security
1. [Authentication](#authentication)
2. [Use HTTPS](#use-https)

### **Security**


#### **Authentication**
To check this metric we use the same query used to test the availability of the SPARQL endpoint (see [here](./availability#sparql-endpoint)), but in this case we check if the status code 401 is returned to us. To quantize the metric, if 401 is returned, we assign 0 to this metric, 1 otherwise.

---

#### **Use HTTPS**
To check if the HTTPS protocol is used, we check if
the link provided to us is on HTTPS protocol and works. If the link is provided in HTTP, then we check if there is an automatic redirect to HTTPS (very common practice). To do this we send an initial request to the HTTP link with a GET, using the Python requests library. If there is a redirect, on the response object that is returned to us, we call the ```geturl()``` method, which contains the link of the last redirect that was executed (if it is carried out). At this point we check if the link obtained is in HTTPS and is working. The last method is to try to force the
request on HTTPS protocol by modifying the link of the SPARQL endpoint and checking the response received. To quantize the metric, if HTTPS is used we assign 1 to this metric, 0 otherwise.