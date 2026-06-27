# 🚍 TravelHub - Online Ticket Booking Platform

TravelHub is a comprehensive and modern Online Ticket Booking Platform built with the MERN stack. It seamlessly connects travelers with ticket vendors, allowing users to discover and book tickets for various transport types (Bus, Train, Launch, Plane) effortlessly. The platform ensures a secure, responsive, and user-friendly experience with dedicated dashboards for Users, Vendors, and Admins.

## 🌐 Live URL & Repositories
- **Live Website:** [TravelHub | Your Ultimate Ticket Booking Platform](https://travell-hub-client.vercel.app)
- **Client-side Repository:** [sohanur-rahman-coding/TravelHub-Client](https://github.com/sohanur-rahman-coding/TravelHub-Client)
- **Server-side Repository:** [sohanur-rahman-coding/TravelHub-server](https://github.com/sohanur-rahman-coding/TravelHub-server)

---

## 🔐 Demo Credentials (For Evaluation)
**Admin Credentials:**
- Email: `sohanbd413@gmaill.com`
- Password: `Abc12345`

**Vendor Credentials:**
- Email: `sohanbd414@gmaill.com`
- Password: `Abc12345`



---

## 🚀 Key Features

### 🌟 General Features
- **Dark/Light Mode Toggle:** Seamless theme switching for better user experience.
- **Search, Filter & Sort:** Advanced search by location (From-To), filter by transport type, and sort by price (Low to High / High to Low).
- **Pagination:** Efficient data loading on the "All Tickets" page.
- **Responsive UI:** Fully responsive design across all devices (Mobile, Tablet, Desktop) with glassmorphism effects and modern styling.
- **Secure Authentication:** Email/Password and Google Social Login powered by BetterAuth.
- **JWT Protection:** Secure API endpoints using JSON Web Tokens.

### 👤 User Features
- **Ticket Booking:** Book available tickets (quantity validation enforced).
- **Dynamic Countdown:** Real-time countdown timer based on departure date and time.
- **Stripe Payment Gateway:** Pay for tickets securely once the vendor accepts the booking request.
- **Dashboard:** Manage booked tickets (Pending/Accepted/Rejected/Paid statuses) and view transaction history.

### 🏪 Vendor Features
- **Ticket Management:** Add, update, or delete tickets with ImgBB image integration.
- **Booking Requests:** Accept or reject user booking requests.
- **Revenue Overview:** Visual data representation (Charts/Graphs) for total tickets added, sold, and overall revenue.
- **Verification System:** Tickets require Admin approval before appearing publicly.

### 🛡️ Admin Features
- **Manage Users:** Change user roles (Make Admin, Make Vendor).
- **Fraud Detection:** Ability to mark a vendor as "Fraud", which instantly hides all their tickets and disables their ticket-adding capability.
- **Manage Tickets:** Approve or reject tickets uploaded by vendors.
- **Advertisement System:** Select up to 6 approved tickets to showcase in the Hero Advertisement section.

---

## 🛠️ Technologies Used

**Frontend:**
- React.js / Next.js (App Router)
- Tailwind CSS (with modern UI libraries like HeroUI/Lucide React)
- BetterAuth (Authentication)
- Stripe.js (Payment processing)
- Axios (Data fetching)

**Backend:**
- Node.js
- Express.js
- JSON Web Token (JWT) for authorization
- Stripe API

**Database & Storage:**
- MongoDB (Mongoose)
- ImgBB API (Image hosting)

---

## ⚙️ Installation & Setup (Local Development)
To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone [https://github.com/sohanur-rahman-coding/TravelHub-Client.git](https://github.com/sohanur-rahman-coding/TravelHub-Client.git)
git clone [https://github.com/sohanur-rahman-coding/TravelHub-server.git](https://github.com/sohanur-rahman-coding/TravelHub-server.git)
```

### 2. Setup Environment Variables
Create a `.env` or `.env.local` file in both client and server directories.

**Client-side `.env.local`:**
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

**Server-side `.env`:**
```env
PORT=5000
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
JWT_SECRET=your_jwt_secret_token
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 3. Install Dependencies & Run
Run the following commands in both the client and server directories:
```bash
npm install
npm run dev
```

---

## 📦 Key NPM Packages Used
- `lucide-react` / `@gravity-ui/icons` (Icons)
- `react-hot-toast` (Notifications)
- `stripe` / `@stripe/react-stripe-js` (Payments)
- `jsonwebtoken` (Auth)
- `animate.css` (Animations)
- `recharts` / `chart.js` (Revenue Charts)
