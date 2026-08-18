# 🍳 RecipeHub — Recipe Sharing Platform

An interactive, full-stack recipe sharing platform where food lovers can discover, publish, bookmark, purchase, and manage culinary recipes. Built with Next.js (App Router), Express.js, MongoDB, Tailwind CSS, Better Auth / JWT, and Stripe Payment Integration.

---

## 🌐 Live Demo & Credentials

- **Live Website:** [Insert Your Live Site Link Here]
- **Client Repository:** [Insert Client Github Link Here]
- **Server Repository:** [Insert Server Github Link Here]

### 🔐 Admin Credentials (for Evaluation)
- **Email:** `admin@recipehub.com`
- **Password:** `Admin123!`

---

## ✨ Key Features & Requirements Coverage

### 👤 User Features
- **Recipe Limit Policy:** Free users can add a maximum of **2 recipes**. Upgrading to Premium unlocks unlimited recipe creation.
- **Recipe Management:** Full CRUD capabilities for own recipes (Add, Edit, Delete, View).
- **Interactive Details Page:**
  - **Like System:** Increment like count in real-time.
  - **Favorites:** Save recipes to personal favorites list.
  - **Stripe Recipe Purchase:** Buy premium recipes securely using Stripe Payment.
  - **Report System:** Flag inappropriate recipes with reason selection (Spam, Offensive, Copyright).
- **Purchased Recipes & Favorites:** Separate tables/cards to view purchased items and manage saved favorites.
- **Profile Customization:** Update name and profile image.

### 🛡️ Admin Dashboard
- **System Metrics Overview:** Dynamic counts for Total Users, Total Recipes, Premium Members, and Total Reports.
- **Manage Users:** View all registered users with Block/Unblock capabilities.
- **Manage Recipes:** Review all recipes across the platform, edit/delete content, and toggle **Featured** status.
- **Report Moderation:** Review user-submitted flags and choose to dismiss or delete the reported recipe.
- **Transaction Logs:** Real-time table displaying User, Amount, Date, Payment Status, and Stripe Transaction ID.

### 💎 Premium Membership (Stripe Checkout)
- Seamless Stripe Checkout integration.
- Grants **Unlimited Recipe Creation** and displays a **Premium Badge** on user profiles and dashboards.
- Payment details stored securely in the `payments` collection.

### 🎨 UI/UX & Quality Assurance
- **Dark / Light Theme:** Global theme toggle.
- **Animations:** Engaging UI animations using **Framer Motion**.
- **Responsive Layout:** Optimized for mobile, tablet, and desktop viewports.
- **Server-Side Pagination & Filtering:** Filter recipes by category using MongoDB `$in` operator and server-side page navigation.
- **Error Handling:** Custom 404 Page, zero reload issues on protected routes, and robust loading spinners.

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** React Icons (`react-icons`)
- **HTTP Client:** Axios / Fetch API

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Native / Mongoose
- **Authentication:** JWT Token in HTTPOnly Cookie / Better Auth
- **Payments:** Stripe SDK

---

## 🗄️ Database Architecture

The system utilizes 5 primary collections in MongoDB:

1. **`users`**: Stores `name`, `email`, `image`, `role`, `isBlocked`, `isPremium`, `createdAt`, `updatedAt`.
2. **`recipes`**: Stores `recipeName`, `recipeImage`, `category`, `cuisineType`, `difficultyLevel`, `preparationTime`, `ingredients`, `instructions`, `authorId`, `authorName`, `authorEmail`, `likesCount`, `isFeatured`, `status`, `createdAt`.
3. **`favorites`**: Stores `userEmail`, `userId`, `recipeId`, `addedAt`.
4. **`reports`**: Stores `recipeId`, `reporterEmail`, `reason`, `status`, `createdAt`.
5. **`payments`**: Stores `userEmail`, `userId`, `amount`, `recipeId`, `transactionId`, `paymentStatus`, `paidAt`.

---

## 🚀 Environment Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Connection URI
- Stripe Developer Account Keys

---

### 1. Server Configuration (`recipehouse-server`)

Clone the server repository and install dependencies:
```bash
git clone [https://github.com/your-username/recipehouse-server.git](https://github.com/your-username/recipehouse-server.git)
cd recipehouse-server
npm install