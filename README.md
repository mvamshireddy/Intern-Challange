Store Rater - Full-Stack Web Application
Store Rater is a comprehensive full-stack application designed to allow users to rate and review stores. It features a robust role-based access control system with three distinct user types: System Administrator, Store Owner, and Normal User.

This project was built as a full-stack coding challenge, demonstrating a modern web development stack with a secure RESTful API backend and a dynamic, responsive React frontend.

Features
👤 Normal User
Authentication: Secure sign-up and login functionality.

Store Listing: View a list of all registered stores with their overall ratings.

Search: Search for stores by name or address.

Rating System: Submit and modify ratings for stores on a scale of 1 to 5.

Profile Management: Update personal password after logging in.

👑 System Administrator
Dashboard: View key metrics at a glance, including total users, total stores, and total submitted ratings.

User Management: Add, view, and filter all users (admins, owners, and normal users) by name, email, address, and role.

Store Management: Add new stores to the platform and view a list of all existing stores with their details.

🏢 Store Owner
Owner Dashboard: View the average rating of their assigned store.

View Raters: See a list of all users who have submitted a rating for their store.

Profile Management: Update personal password.

Tech Stack
Backend: Node.js with Express.js

Frontend: React.js

Database: MySQL

Authentication: JSON Web Tokens (JWT)

ORM: Sequelize

Getting Started
Follow these instructions to set up and run the project on your local machine.

Prerequisites
Node.js (v16 or later)

MySQL (or another SQL client like MariaDB)

1. Backend Setup
First, set up the database and the Express server.

a. Clone the repository:

git clone <your-repository-url>
cd <project-folder>/backend

b. Install dependencies:

npm install

c. Create the Database:
Log in to your MySQL client and create a new database.

CREATE DATABASE store_ratings_db;

d. Configure Environment Variables:
Create a file named .env in the backend directory and add the following configuration. Replace the placeholder values with your actual database credentials.

# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=store_ratings_db

# JWT Configuration
JWT_SECRET=a_very_strong_and_secret_key_for_jwt

e. Run the Backend Server:
The server will automatically sync the database schema (create the tables) on its first run.

npm start

The backend API should now be running on http://localhost:5000.

2. Frontend Setup
Now, set up the React client.

a. Navigate to the frontend directory:

cd ../frontend

b. Install dependencies:

npm install

c. Run the Frontend Development Server:

npm start

The React application should now be running on http://localhost:3000.

Usage
Create the First Admin User: Since there are no users initially, you'll need to create the first admin directly in the database. Use a SQL client to run:

INSERT INTO users (name, email, password, address, role, createdAt, updatedAt) 
VALUES (
  'Primary System Administrator',
  'prime.admin@system.com',
  '$2a$10$Rz2q.c.m.eG5j.hK9l.pM.A1b.C2d.E3f.G4h.I5j.K6l.mN7n', -- This hash is for the password 'PrimeAdmin1@'
  '1 Admin Plaza, System Control, Hyderabad, 500081',
  'admin',
  NOW(),
  NOW()
);

Log in as Admin: Go to http://localhost:3000/login and use the credentials:

Email: prime.admin@system.com

Password: PrimeAdmin1@

Use the App: From the admin dashboard, you can now add new users (including store owners) and new stores. Log out and log in with different roles to test the full range of functionalities.
