# 🚍 TravelHub - Online Ticket Booking Platform

TravelHub is a comprehensive, full-featured modern Online Ticket Booking Platform built with **Next.js 16 (App Router)**, **Tailwind CSS**, **Node.js/Express**, and **MongoDB Atlas**. It connects travelers with transport operators across multiple transit types (Bus, Train, Launch, Flight) with real-time seat locks, secure Stripe payments, interactive reviews, dynamic countdowns, and dedicated dashboards for Users, Vendors, and Admins.

## 🌐 Live URL & Repositories
- **Live Website:** [TravelHub | Your Ultimate Ticket Booking Platform](https://travell-hub-client.vercel.app)
- **Client-side Repository:** [sohanur-rahman-coding/TravelHub-Client](https://github.com/sohanur-rahman-coding/TravelHub-Client)
- **Server-side Repository:** [sohanur-rahman-coding/TravelHub-server](https://github.com/sohanur-rahman-coding/TravelHub-server)

---

## 🔐 Demo Credentials (For Evaluation)
**Admin Credentials:**
- Email: `sohanbd413@gmail.com`
- Password: `Abc12345`

**Vendor Credentials:**
- Email: `sohanbd413@gmail.com`
- Password: `Abc12345`

---

## 🚀 Key Features

### 🌟 General & Platform Features
- **Dark/Light Mode:** Seamless theme switching with smooth transitions and persistent state.
- **Search, Filter & Sort:** Filter tickets by transport type (Bus, Train, Launch, Flight), departure/destination points, and sort by price or popularity with full pagination.
- **Interactive Seat Map & Hold System:** Interactive visual seat selection with temporary locking (preventing double-bookings) and automatic cleanup after timeout or manual cancellation.
- **AI / Live Chat Support Widget:** Floating interactive support widget with responsive guidance.
- **Glassmorphism & Micro-animations:** Styled with Tailwind CSS, Framer Motion, and HeroUI for a modern visual aesthetic.
- **Secure Authentication:** BetterAuth integration with Email/Password and Google OAuth.
- **Edge Route Middleware:** Fast, Edge-compatible route guard protecting `/dashboard` and `/profile` routes.

### 👤 User (Passenger) Features
- **Seat Booking & Reservation:** Select specific seats, view live price breakdowns, and reserve seats in real time.
- **Secure Stripe Checkout:** Pay for accepted bookings using Stripe Elements / Checkout with idempotency protection.
- **Interactive Invoices & Receipts:** Downloadable/printable ticket receipts with QR codes and booking reference numbers.
- **Reviews & Ratings:** Leave star ratings and written reviews on completed travel routes.
- **User Dashboard:** Track booked tickets (`Pending`, `Accepted`, `Paid`, `Cancelled`), release held seats, and review transaction history.

### 🏪 Vendor (Operator) Features
- **Ticket Management:** Add, update, and manage transport tickets with multi-perk selection, departure schedules, and ImgBB image uploads.
- **Booking Requests Panel:** Real-time dashboard to accept or reject passenger booking requests.
- **Revenue & Performance Analytics:** Visual chart breakdown (Recharts) of tickets added, tickets sold, and total earnings.
- **Verification Workflow:** Automatic submission to Admin moderation queue before public listing.

### 🛡️ Admin (Superuser) Features
- **User Role Management:** Promote or demote users between `user`, `vendor`, and `admin` roles with instant UI state synchronization.
- **Ticket Moderation:** Approve, reject, or mark tickets as featured advertisements on the homepage hero section.
- **Fraud Detection System:** Ability to mark fraudulent vendors, automatically revoking ticket-creation rights and hiding affected routes.
- **Platform Analytics:** Real-time platform revenue and activity summary.

---

## 🛠️ Technologies Used

**Frontend:**
- **Framework:** Next.js 16 (App Router, React 19)
- **Styling:** Tailwind CSS, Framer Motion, HeroUI, Lucide React
- **Authentication:** BetterAuth (JWT & Cookie Cache)
- **Payments:** Stripe.js (`@stripe/stripe-js`, `@stripe/react-stripe-js`)
- **Notifications:** React Hot Toast
- **Charts:** Recharts

**Backend & Data:**
- **Runtime:** Node.js & Express.js
- **Database:** MongoDB Atlas (Native MongoDB Driver)
- **Payment Processing:** Stripe Node SDK
- **Image Hosting:** ImgBB API

---

## ⚙️ Installation & Setup (Local Development)

### 1. Clone the repositories
```bash
git clone https://github.com/sohanur-rahman-coding/TravelHub-Client.git
git clone https://github.com/sohanur-rahman-coding/TravelHub-server.git
```

### 2. Configure Environment Variables
Create a `.env.local` file inside the `TravellHub-client` directory:
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

### 3. Install Dependencies & Run
```bash
cd TravellHub-client
npm install
npm run dev
```
The client app will be accessible at `http://localhost:3000`.

---

## 📦 Key NPM Packages Used
- `@stripe/react-stripe-js` & `@stripe/stripe-js` (Stripe Payment Integration)
- `better-auth` (Authentication & Session Management)
- `framer-motion` (Fluid UI Animations)
- `lucide-react` (Iconography)
- `react-hot-toast` (Toast Notifications)
- `recharts` (Analytics & Charts)
