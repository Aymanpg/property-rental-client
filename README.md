# RentEase — Property Rental & Booking Platform

> A transparent marketplace connecting tenants and property owners — find a place, list a place, book it securely.

![RentEase Banner](./public/images/bannerforReadme.png)

---

## 🔗 Live Links

| | Link |
|---|---|
| 🌐 **Frontend (Live)** | [property-rental-client-nextjs.vercel.app](https://property-rental-client-nextjs.vercel.app) |
| ⚙️ **Backend API** | [property-rental-server.onrender.com](https://property-rental-server.onrender.com) |
| 💻 **Client Repository** | [GitHub — Client](https://github.com/your-username/property-rental-client-nextjs) |
| 🖥️ **Server Repository** | [GitHub — Server](https://github.com/your-username/property-rental-server) |

---

## 📌 Project Purpose

**RentEase** is a full-stack property rental and booking platform where:

- 🏠 **Property Owners** can list rental properties with images, amenities, and pricing
- 🔍 **Tenants** can browse, search, filter, book, and pay for properties online
- 🛡️ **Admins** moderate the platform — approving/rejecting listings and managing users

The platform provides a secure, transparent rental experience with Stripe-powered payments, role-based dashboards, and real-time notifications.

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- Email/Password registration and login via Firebase
- Google Social Login (auto-assigned Tenant role)
- JWT-based API security
- Role-based access control: **Tenant**, **Owner**, **Admin**
- Protected routes — private pages remain accessible on reload

### 🏡 Property Management
- Owners can add, update, and delete property listings
- Properties require Admin approval before going live
- Admin rejection includes feedback visible to the Owner
- Property search by location, type, price range with sorting

### 📅 Booking System
- Tenants can book properties with move-in date and contact details
- Booking clash prevention (same property, same date)
- Booking status tracking: **Pending → Approved / Rejected**
- Owners receive booking requests with full tenant details

### 💳 Stripe Payment Integration
- Secure Stripe payment gateway for booking fees
- Pre-payment booking clash validation
- Transaction records saved after successful payment
- Full payment history in Admin Dashboard

### 🔔 Notification System
- Real-time notifications for all key events
- Booking submitted → tenant and owner notified
- Booking approved/rejected → tenant notified
- Property approved/rejected → owner notified
- Unread count badge on notification bell icon
- Mark individual or all notifications as read

### 📊 Owner Analytics Dashboard
- Total Earnings, Total Properties, Total Bookings summary cards
- Monthly Earnings Line Chart (last 12 months) powered by Recharts

### ⭐ Review System
- Tenants can rate (1–5 stars) and review properties
- Reviews visible on Property Details page
- Only tenants can submit reviews (admins and owners restricted)

### 🧑‍💼 Role-Based Dashboards
- **Tenant:** My Bookings, Favorites, Profile
- **Owner:** Analytics, Add Property, My Properties, Booking Requests, Profile
- **Admin:** All Users, All Properties, All Bookings, Transactions

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | React framework with file-based routing |
| **Tailwind CSS v4** | Utility-first styling with custom design tokens |
| **Firebase Auth** | Authentication (email/password + Google) |
| **Axios** | HTTP requests to backend API |
| **Stripe.js** | Payment processing |
| **Recharts** | Owner analytics charts |
| **Framer Motion** | Animations (banner, featured properties) |
| **React Hot Toast** | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express.js** | REST API server |
| **MongoDB Atlas + Mongoose** | Database and ODM |
| **JSON Web Token (JWT)** | API authentication |
| **Stripe** | Payment intent creation |
| **CORS** | Cross-origin request handling |
| **Dotenv** | Environment variable management |
| **Nodemon** | Development auto-restart |

### Deployment
| Service | Purpose |
|---|---|
| **Vercel** | Frontend deployment |
| **Render** | Backend deployment |
| **MongoDB Atlas** | Cloud database |
| **Firebase** | Authentication provider |

---



## 📁 Project Structure (Overview)

```
property-rental-platform/
├── client/                     ← Next.js Frontend (Vercel)
│   └── src/
│       ├── app/                ← All routes (Next.js App Router)
│       │   ├── page.js         ← Home page
│       │   ├── login/          ← Login page
│       │   ├── register/       ← Register page
│       │   ├── properties/     ← All Properties + [id] Details
│       │   ├── payment/        ← Payment + Success pages
│       │   └── dashboard/      ← Tenant / Owner / Admin dashboards
│       ├── components/         ← Reusable UI components
│       ├── context/            ← AuthContext (global auth state)
│       ├── hooks/              ← useAuth, useAxiosSecure
│       └── lib/                ← Firebase config, Axios instance
│
└── server/                     ← Express Backend (Render)
    ├── models/                 ← Mongoose schemas
    ├── routes/                 ← API route handlers
    └── middleware/             ← JWT verify, Role check
```


## 👨‍💻 Developer

**Aymanur Rahman**
- AIUB — Computer Science & Engineering
- Junior Frontend Developer (React.js, Next.js, MERN Stack)

---



---

<p align="center">Made with ❤️ for tenants & owners, everywhere.</p>
