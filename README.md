🛒 MultiVendor Marketplace Platform

A full-stack multi-vendor eCommerce marketplace where multiple vendors can sell products, customers can place orders, and the admin manages commissions, reports, and platform operations.

Built with MERN Stack + Real-time Socket Updates + Payment Integration

🚀 Tech Stack
Frontend

React.js

Redux Toolkit

Tailwind CSS

React Router

Axios

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Socket.IO (Real-time updates)

Razorpay Payment Gateway

👥 User Roles
Role	Description
Admin	Manages platform, vendors, commissions, reports
Vendor	Adds products, tracks sales, views earnings
Customer	Browses products, places orders, tracks delivery
🔐 Authentication System

JWT based login stored in HTTP-Only cookies

Role-based route protection using:

authMiddleware

authorizeRoles("admin" | "vendor" | "customer")

🧑‍💼 Admin Features
📊 Dashboard

Total Orders

Total Revenue

Vendor Count

Customer Count

Order Status Analytics

Earnings Last 7 Days

🏪 Vendor Management

Approve / Reject Vendors

Block / Unblock Vendors

View Vendor List

💰 Commission Management

Global Commission %

Vendor-Specific Commission %

Vendor Commission Report

📈 Sales Reports

Vendor-wise Sales Report

Platform Earnings Report

Order Status Statistics

📩 Contact Messages

View customer messages

Mark as read

Delete messages

Unread badge count

🏬 Vendor Features
📦 Product Management

Add / Edit / Delete Products

Upload product images

Manage stock levels

📊 Sales Dashboard

Product-wise Sales Report

Quantity sold per product

Gross Sales

Platform Commission Deducted

Vendor Earnings

🚚 Order Management

View vendor orders

Update order status (Packed / Shipped / Delivered)

Real-time status update to customers via Socket.IO

🛍 Customer Features
🛒 Shopping

Browse products by category

Search products

View product details

Add to cart

💳 Checkout & Payment

Cash on Delivery (COD)

Online Payment via Razorpay

Secure payment verification

📦 Orders

View order history

Track live order status

Vendor-wise order tracking

Real-time updates using WebSockets

⭐ Reviews

Rate purchased products (1–5 stars)

Average rating auto-calculated

🔄 Real-Time Features

Using Socket.IO

Event	Description
joinOrderRoom	Customer joins their private room
orderStatusUpdated	Vendor updates order → customer sees live change
💰 Commission System
Global Commission

Admin sets default commission % applied to all vendors.

Vendor-Specific Commission

Overrides global commission for selected vendors.

Commission Calculation (At Order Time)
commissionAmount = vendorSubTotal * commissionPercent / 100
vendorEarning = vendorSubTotal - commissionAmount


Stored in:

VendorOrder

OrderCommission collection

📊 Reports System
Admin Reports

Vendor-wise sales

Platform commission earned

Date-filtered revenue reports

Vendor Reports

Product-wise sales

Earnings per product

Commission deductions

🗂 Database Structure (Main Collections)
Collection	Purpose
Users	Admin / Vendor / Customer login
Vendors	Vendor profile info
Products	Vendor products
Orders	Main customer orders
VendorOrders	Split vendor-wise orders
OrderItems	Product-level order records
OrderCommission	Commission tracking
Reviews	Product ratings
Cart	Customer cart
ContactMessages	Customer contact form
🛡 Security

JWT Authentication

Role-based Authorization

HTTP-Only Cookies

Payment signature verification (Razorpay)

Protected admin/vendor/customer routes

⚙️ Installation
Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm run dev