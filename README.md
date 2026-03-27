# 🎓 Certify

A full-stack MERN application that allows institutions to **issue, manage, and verify certificates securely**.

---

## 🚀 Live Demo

* 🌐 **Frontend (Vercel):** 
* ⚙️ **Backend (Render):** https://certify-3bms.onrender.com

---

## 📌 Features

### 🔐 Authentication

* Google OAuth Login
* Role-based access (Admin / Student)

---

### 🎓 Admin Dashboard

* Generate certificates manually
* Upload certificates via CSV
* Manage certificate records
* Revoke / Restore certificates
* Export certificate data (CSV)
* View analytics (issued, verification checks)

---

### 👨‍🎓 Student Dashboard

* View owned certificates
* Download certificates
* Share certificate links
* Track certificate status

---

### 🔍 Public Verification

* Verify certificates using Certificate ID
* Shows:

  * Valid / Invalid / Revoked status
  * Certificate details (limited view)

---

## 🧠 How It Works

1. Admin generates or uploads certificates
2. Certificates are stored in MongoDB
3. Each certificate has a unique ID
4. Users can verify certificates using that ID
5. System checks database:

   * Exists → Valid
   * Revoked → Revoked
   * Not found → Invalid

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS / Custom CSS
* React Router

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Other

* Google OAuth
* CSV Parsing
* PDF Generation (optional)

---

## 📁 Project Structure

```
project-root/
 ├── frontend/
 ├── backend/
 ├── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the backend folder:

```
MONGO_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
PORT=5000
```

---

## ▶️ Run Locally

### 1️⃣ Clone the repository

```
git clone https://github.com/Githubuyir/Certify.git
cd Certify
```

---

### 2️⃣ Install dependencies

#### Backend

```
cd backend
npm install
```

#### Frontend

```
cd frontend
npm install
```

---

### 3️⃣ Run the app

#### Backend

```
npm run dev
```

#### Frontend

```
npm run dev
```

---

## 📊 Export Feature

* Export certificate records as CSV
* Supports:

  * Export All
  * Export Filtered Data

---

## 🔒 Security Features

* Environment variables for sensitive data
* Restricted certificate downloads (only authenticated users)
* Public verification without exposing full certificate

---

## 💡 Future Improvements

* QR code-based verification
* Email notifications
* Certificate templates customization
* Analytics dashboard enhancements

---

## 👨‍💻 Author

**Steven Abraham**

---

## 📄 License

This project is for educational purposes.
