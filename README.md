# 🦷 Dental Clinic Dashboard - React Application

A feature-rich Dental Clinic Management Dashboard built with **React**, designed to manage patients, appointments, and treatments efficiently. This application uses **mock data only** (no backend or database), making it ideal for demos, assignments, and frontend-focused development.

---

## ✨ Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Nageshwar-Bedge/dental-center-dashboard.git
cd dental-center-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

📍 App will run at: `http://localhost:5173`

---

## 🌐 Tech Stack

| Area                | Technology                     |
|---------------------|--------------------------------|
| **Frontend**        | React + Vite                   |
| **Styling**         | Tailwind CSS                   |
| **State Management**| React Context API              |
| **Icons**           | Lucide-React                   |
| **Mock Data Persistence** | In-memory only (no backend or DB) |

---

## 📁 Architecture Overview

```
/src
├── components/         # Reusable UI components (Forms, Cards, Modals)
├── context/            # DataProvider - global state using React Context
├── pages/              # Page views: Dashboard, Patients, Reports
├── types/              # Type declarations for patients/incidents
├── App.jsx             # Root component with route configs
├── main.jsx            # Entry point of app
└── index.css           # Tailwind and global styles
```

---

## ⚙️ Core Features

- **Add, update, and delete patients**
- **Record and edit treatment incidents**
- **Track appointment statuses**: Scheduled, In-Progress, Completed
- **Dashboard metrics**: total patients, total appointments, monthly & weekly revenue
- **Form validation** and error handling
- **Responsive UI** using modals and Tailwind
- **Modern icons** with Lucide-React

---

## 🤞 Mock Data Used

Stored in-memory (no persistence):

- **INITIAL_PATIENTS**: Sample patient records
- **INITIAL_INCIDENTS**: Appointment and treatment logs
- **Dashboard metrics** computed from mock data

No backend or database is used. Ideal for local development or frontend demos.

---

## 🛠️ Technical Decisions

| Area            | Choice & Reason                                      |
|-----------------|------------------------------------------------------|
| **State**       | Context API - lightweight and scoped                 |
| **Build**       | Vite - fast dev server & HMR support                 |
| **Styling**     | Tailwind CSS - utility-first & responsive design     |
| **Redux**       | Not used - unnecessary for app scale                 |
| **DB/API**      | Skipped - app uses static mock data only             |

---

## ⚠️ Known Issues / Limitations

- Data is lost on page refresh (in-memory only)
- No authentication or authorization implemented
- Mobile responsiveness can be improved
- File uploads are mocked (no real upload functionality)

---

## 🎯 Future Improvements

- Add Firebase or Auth0 for user authentication
- Use Supabase or Firebase for data persistence
- Add filtering, sorting, and searching capabilities
- Export patient or incident reports to PDF/CSV
- Improve mobile responsiveness and accessibility

---

## 👨‍💻 Author

**Nageshwar Bedge**  
```bash
https://github.com/Nageshwar-Bedge
```
