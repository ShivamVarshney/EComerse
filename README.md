🛒 MERN Stack E-Commerce Platform
A fully functional, high-performance E-commerce application featuring a custom Admin Dashboard, secure authentication, and real-time sales analytics.



🌟 Key Features
👤 User Features
Authentication: Secure signup and login using JWT and HTTP-only cookies.

Shopping Cart: Add/remove items, update quantities, and persistent storage.

Product Search: Efficient filtering and searching of products.

Order Tracking: Users can view their order history and payment status.

🛡️ Admin Features (Admin Dashboard)
Sales Analytics: Visual representation of sales using ApexCharts.

Product Management: CRUD (Create, Read, Update, Delete) functionality for products and categories.

Order Management: Track all customer orders, mark as paid, or mark as delivered.

User Management: View and manage all registered users.

🛠️ Tech Stack
Frontend:

React.js: Library for building the UI.

Redux Toolkit: For global state management.

RTK Query: To handle API caching and data fetching.

Tailwind CSS: For modern, responsive styling.

ApexCharts: For interactive data visualization.

Backend:

Node.js & Express.js: Server-side logic and RESTful API.

MongoDB & Mongoose: NoSQL database for flexible data storage.

JWT (JSON Web Token): For secure session-based authentication.

📁 Project Structure
Plaintext

root/
├── backend/           # Node.js API, Models, Controllers, and Routes
│   ├── data/          # Seed data (optional)
│   ├── middlewares/   # Auth and Error handlers
│   └── server.js      # Entry point
└── frontend/          # React application
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── redux/      # API slices and global store
    │   └── pages/      # Dashboard and Shop pages
