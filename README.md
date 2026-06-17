# 📚 StudyShare Pro - Full-Stack Notes Sharing Platform

StudyShare Pro is a dynamic and professionally structured **Full-Stack (Node.js/Express/MongoDB)**
web application designed for Computer Science Engineering (CSE) students to manage and share study materials.

---

## 🎯 Project Overview
StudyShare Pro acts as a centralized digital library for students. The core functionality allows users to:
* **Browse Study Material:** Students can view uploaded notes, PYQs, and assignments in a clean interface.
* **Upload Notes:** Users can contribute to the community by uploading their own study notes.
* **Account Management:** Secure login and registration system to keep user contributions tracked and safe.
* **Administrative Control:** Admins can manage the database and ensure the quality of notes shared on the platform.

---

## 📂 Project Structure (MVC Architecture)

The backend ecosystem is cleanly organized using the Model-View-Controller pattern:
* **`config/`** - Database connection settings (`db.js` - Secured using Environment Variables).
* **`controllers/`** - Core business logic (`authController.js`, `noteController.js`, `paymentController.js`).
* **`models/`** - MongoDB database schemas (`User.js`, `Note.js`).
* **`routes/`** - API endpoints mapped to specific controllers (`authRoutes.js`, `noteRoutes.js`, `paymentRoutes.js`).
* **`index.js`** - The main entry point of the server.
* **`index.html`** - Frontend UI interface.

---

## 🚀 Key Features

* **Secure User Authentication:** Fully functional Sign Up and Login system managed via `authController.js` with database validation.
* **Notes Management Pipeline:** Allows students to browse, upload, and delete study notes (PDFs) effortlessly.
* **Payment Integration Framework:** The backend routing architecture is fully set up. (The frontend currently displays a user-friendly "Coming soon in the next update" alert system).
* **High-Security Standards:** Highly sensitive database credentials are completely protected using `.env` (Environment Variables) and `.gitignore` configurations.

---

## 🛠️ Tech Stack Used

* **Frontend:** HTML5, CSS3, JavaScript (Fetch API)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose Object Modeling)

---

## 📬 Connect With Me

If you have any questions regarding this project or want to collaborate, feel free to reach out:

* **Email:** [yuvrajchaturvedi249@gmail.com](mailto:yuvrajchaturvedi249@gmail.com)
* **LinkedIn:** [Yuvraj Chaturvedi](https://www.linkedin.com/in/yuvraj-chaturvedi-a4a234331)

---

## 📝 License
This project is open-source and available under the MIT License. Developed for academic and portfolio enhancement.
