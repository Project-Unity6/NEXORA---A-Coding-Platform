# HTTP Status Codes Cheat Sheet

This document summarizes the most common **HTTP status codes** used in web development. Knowing these codes is essential for building APIs, debugging, and handling errors properly.

---

## 1️⃣ Informational Responses (100–199)

| Status Code | Meaning                   | Description |
|------------|---------------------------|-------------|
| 100        | Continue                  | Server has received the request headers, the client should continue sending the request body. |
| 101        | Switching Protocols       | Server is switching protocols as requested by the client. |
| 102        | Processing                | WebDAV: server has received the request and is processing it. |

---

## 2️⃣ Success (200–299)

| Status Code | Meaning            | Description |
|------------|------------------|-------------|
| 200        | OK                 | Request succeeded, response contains requested data. |
| 201        | Created            | Resource successfully created (commonly used after POST). |
| 202        | Accepted           | Request accepted but not yet processed. |
| 204        | No Content         | Request succeeded, no content to return (commonly for DELETE). |

---

## 3️⃣ Redirection (300–399)

| Status Code | Meaning               | Description |
|------------|--------------------|-------------|
| 301        | Moved Permanently    | Resource permanently moved to new URL. |
| 302        | Found / Temporary    | Resource temporarily moved to a different URL. |
| 304        | Not Modified         | Resource has not been modified; client can use cached version. |

---

## 4️⃣ Client Errors (400–499)

| Status Code | Meaning             | Description |
|------------|------------------|-------------|
| 400        | Bad Request        | Server cannot process request due to client error (invalid syntax). |
| 401        | Unauthorized       | Client must authenticate (login required). |
| 403        | Forbidden          | Client does not have permission to access this resource. |
| 404        | Not Found          | Requested resource could not be found. |
| 405        | Method Not Allowed | HTTP method is not supported for this endpoint. |
| 409        | Conflict           | Request conflicts with the current state of the resource (e.g., duplicate). |
| 429        | Too Many Requests  | Client has sent too many requests in a given time (rate limiting). |

---

## 5️⃣ Server Errors (500–599)

| Status Code | Meaning            | Description |
|------------|-----------------|-------------|
| 500        | Internal Server Error | Generic server error. Something went wrong on the server. |
| 501        | Not Implemented      | Server does not support requested functionality. |
| 502        | Bad Gateway          | Server received an invalid response from upstream server. |
| 503        | Service Unavailable  | Server is temporarily unavailable (overloaded or maintenance). |
| 504        | Gateway Timeout      | Upstream server did not respond in time. |

---

## ✅ Tips for Web Developers

- Always return **appropriate status codes** in your APIs.
- Use **2xx** for success, **4xx** for client errors, and **5xx** for server errors.
- Combine with meaningful **error messages** in JSON for better frontend debugging.
- Example:

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "The requested user ID does not exist."
}