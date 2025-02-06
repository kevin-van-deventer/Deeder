✅ ***Project Setup***

1️⃣ **Backend - Rails API**
 * Initialize Rails API (rails new backend --api --database=sqlite3)
 * Setup sqlite3 as the database
 * Install required gems (bcrypt, jwt, rack-cors, active_storage)
 * Setup authentication without Devise
 * Implement JWT-based authentication for login/signup
 * Create Users model and controller

2️⃣ **Frontend - React**
* Initialize React (npx create-react-app frontend)
* Install dependencies (react-router-dom, axios, jwt-decode)
* Setup routing and authentication
* Display login/signup pages
* Redirect users to dashboard if authenticated

👥 ***User Authentication***
3️⃣ **Users (Accounts)**
* Users must be able to sign up with:
* First Name, Last Name, Email, Password
* Upload a government ID document (jpg, png, pdf)
* Users must be able to log in and receive a JWT token
* Store JWT in localStorage
* Show dashboard if logged in, otherwise show login/signup
* Logout functionality

📌 ***Deeds (Tasks)***
4️⃣ Users Can Request and Respond to Deeds
* Users can create deeds (POST /deeds)
* Users can view all unfulfilled deeds (GET /deeds)
* Users can volunteer for deeds (POST /deeds/:id/volunteer)
* Users can complete deeds (POST /deeds/:id/complete)
* Deeds have:
    Requester (user who created it)
    Multiple volunteers (deeders)
    Completed by (user who finishes the deed)
    Type: one-time or material
    Status: fulfilled or unfulfilled

📍 ***Map Integration***
5️⃣ Display Deeds on a Map (Google Maps API)
 * Show unfulfilled deeds as markers on the map
 * Color-code one-time vs. material needs
 * Clicking a marker should display deed details
 * Map should auto-refresh when moved (like Airbnb, Yelp)

🔄 ***API Endpoints***
6️⃣ Backend Routes (config/routes.rb)
Users
    POST /users → Create a user
    POST /login → Login and receive JWT
    GET /users/:user_id/deeds → Fetch deeds requested/volunteered by user
Deeds
    GET /deeds → List all unfulfilled deeds
    POST /deeds → Create a deed
    POST /deeds/:id/volunteer → Volunteer for a deed
    POST /deeds/:id/complete → Mark a deed as completed

🖥️ ***Frontend Features***
7️⃣ React Frontend Components
 AppRouter.js → Handles public/private routes
 SignupPage.js → User registration
 LoginPage.js → User login
 Dashboard.js → Displays user deeds
 DeedsMap.js → Shows deeds on Google Maps
 DeedDetails.js → Displays details of selected deed

📊 ***Live Updates & Performance***
8️⃣ Additional Features
 Counter showing number of unfulfilled deeds
 Counter auto-updates every few seconds
 WebSockets for real-time updates (optional)
 Deploy API & Frontend (Heroku, Netlify, or similar)

✅ Next Steps
Implement Google Maps API
Create DeedsMap.js to display deeds
Deploy backend & frontend

🚀 Summary
* Users can sign up, log in, and request/respond to deeds.
* Deeds are stored in the database with multiple    volunteers.
* React frontend dynamically fetches and displays user-specific deeds.
* Google Maps API will show real-time locations of deeds.