# API Documentation 🔌

This document details the API endpoints available in the **Yoshlar Qalqoni AI** application.

---

## 1. Authentication Endpoints

### POST `/api/auth/login`
Authenticates a user and sets secure cookies.
- **Request Body:**
  ```json
  {
    "username": "admin",
    "password": "123"
  }
  ```
- **Responses:**
  - `200 OK` (Success):
    ```json
    {
      "success": true,
      "user": {
        "username": "admin",
        "role": "admin",
        "name": "Yoshlar Qalqoni",
        "avatar": "YQ"
      }
    }
    ```
  - `401 Unauthorized` (Invalid credentials)
  - `423 Locked` (Account / IP temporarily locked)
  - `429 Too Many Requests` (Rate limit exceeded)

---

### POST `/api/auth/logout`
Revokes the current session and clears authorization cookies.
- **Query Parameters:**
  - `all=true` (Optional: Set to `true` to delete all sessions across all devices for this user)
- **Response:**
  - `200 OK`:
    ```json
    {
      "success": true,
      "message": "Logged out successfully"
    }
    ```

---

### POST `/api/auth/refresh`
Refreshes the Access Token using the HttpOnly Refresh Token cookie. Checked against the stored hashed tokens and device fingerprint.
- **Response:**
  - `200 OK`:
    ```json
    {
      "success": true
    }
    ```
  - `401 Unauthorized` (Session expired or fingerprint mismatch causing auto-revocation)

---

### GET `/api/auth/me`
Retrieves the profile of the currently logged-in user.
- **Response:**
  - `200 OK`:
    ```json
    {
      "success": true,
      "user": {
        "id": "14cd9ca4-...",
        "username": "admin",
        "role": "admin",
        "name": "Yoshlar Qalqoni",
        "avatar": "YQ"
      }
    }
    ```

---

### GET `/api/auth/sessions`
Lists all active sessions/devices associated with the logged-in user.
- **Response:**
  - `200 OK`:
    ```json
    {
      "success": true,
      "sessions": [
        {
          "id": "session-uuid",
          "ipAddress": "127.0.0.1",
          "userAgent": "Mozilla/5.0 ...",
          "createdAt": "2026-06-08T10:00:00Z",
          "isCurrent": true
        }
      ]
    }
    ```

---

## 2. Business Entity Endpoints

All business entity endpoints require active authentication cookies.

### GET `/api/youth`
Queries and paginates youth profiles (automatically filters out soft-deleted records).
- **Query Parameters:**
  - `search` (Optional: Search query filtering by Name, Surname, JSHSHIR, or Passport)
  - `xavf` (Optional: Filter by risk level - High, Medium, Low)
  - `mahalla` (Optional: Filter by Mahalla name)
  - `page` (Optional: Default `1`)
  - `limit` (Optional: Default `10`)
- **Response:**
  - `200 OK`:
    ```json
    {
      "success": true,
      "total": 30,
      "page": 1,
      "limit": 10,
      "totalPages": 3,
      "items": [
        {
          "id": "uuid",
          "ism": "Asadbek",
          "familiya": "Karimov",
          "jshshir": "30000000000000",
          "pasport": "AB12345",
          "yil": "2005",
          "jins": "Erkak",
          "telefon": "+998 90 700-00-00",
          "davomat": "95",
          "xavf": "Past xavf",
          "maktab": "IT Park",
          "izoh": "Notes...",
          "mahalla": "Guliston",
          "mahallaId": "mahalla-uuid"
        }
      ]
    }
    ```

---

### POST `/api/youth`
Creates a new youth profile (restricted to admin/uchastkavoy/raisi/yetakchi roles).
- **Request Body:**
  ```json
  {
    "ism": "Asadbek",
    "familiya": "Karimov",
    "jshshir": "30000000000000",
    "pasport": "AB12345",
    "yil": 2005,
    "jins": "Erkak",
    "telefon": "+998 90 700-00-00",
    "davomat": 95,
    "xavf": "Past xavf",
    "maktab": "IT Park",
    "izoh": "Notes...",
    "mahallaId": "mahalla-uuid"
  }
  ```

---

### DELETE `/api/youth/[id]`
Soft-deletes a youth profile by setting `deletedAt = new Date()` (restricted to admins only).
- **Response:**
  - `200 OK`:
    ```json
    {
      "success": true,
      "message": "Profile deleted successfully"
    }
    ```

---

## 3. System Administration Endpoints

### GET `/api/health`
Public lightweight health monitoring check.
- **Response:**
  - `200 OK`:
    ```json
    {
      "status": "ok"
    }
    ```

---

### GET `/api/admin/health`
Protected administrative check (requires `admin` role). Tests connections and extracts resource stats.
- **Response:**
  - `200 OK` / `500 Internal Error`:
    ```json
    {
      "status": "healthy",
      "database": "ok",
      "sentry": "configured",
      "memory": {
        "rss": "111.12 MB",
        "heapTotal": "27.18 MB",
        "heapUsed": "20.73 MB",
        "external": "16.73 MB"
      },
      "uptime": "123.45 seconds"
    }
    ```

---

### GET `/api/audit`
Returns paginated system logs (requires `admin` role).
- **Query Parameters:**
  - `page` (Default `1`)
  - `limit` (Default `20`)
- **Response:**
  - `200 OK`:
    ```json
    {
      "success": true,
      "total": 124,
      "page": 1,
      "limit": 5,
      "totalPages": 25,
      "items": [
        {
          "id": "log-uuid",
          "userId": "user-uuid",
          "action": "login",
          "details": {
            "message": "User logged in successfully via web client",
            "ipAddress": "127.0.0.1",
            "userAgent": "Mozilla/5.0 ...",
            "deviceFingerprint": "5b401d84b8..."
          },
          "ipAddress": "127.0.0.1",
          "createdAt": "2026-06-08T10:34:39Z",
          "user": {
            "username": "admin",
            "name": "Yoshlar Qalqoni",
            "role": "admin"
          }
        }
      ]
    }
    ```
