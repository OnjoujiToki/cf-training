# Fall 2023 INFO-6150 Final Project Team 20
# **Documentation**

## Team Members
- Bote Wang
- Zhihao Zhang

## Technology Stack
- Frontend: React, HTML, CSS, JavaScript, Bootstrap
- Backend: Firebase API, Firebase Authentication, Firebase Hosting, Firebase Storage
- Middleware: Axios

## How to run
1. Clone the repository
2. Run `npm install` to install all dependencies
3. Run `npm start` to start the application
4. Open `http://localhost:3000` to view it in the browser

**Or**, you can visit the website directly: https://cf-training-90168.web.app/

## Structure
```
.
├── README.md
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── components
│   │   ├── Footer.js
│   │   ├── Header.js
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Plan.js
│   │   ├── PlanDetail.js
│   │   ├── Plans.js
│   │   ├── Register.js
│   │   ├── TrainingPlan.js
│   │   ├── TrainingPlanDetail.js
│   │   ├── TrainingPlans.js
│   │   └── User.js
│   ├── firebase.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── reportWebVitals.js
│   ├── setupTests.js
│   └── utils
│       └── auth.js
└── yarn.lock
```

## UI Components Overview
- **Dashboard** : Homepage and Landing Page for most users, to see a clear view of everything in summary
- Training Plans : View people's training plans. What is trending?
- Training Plan Detail : See your own training plan in detail.
- Training Plan Creation : Create your own training plan. Fit it to your needs. Share with others!
- User Settings : Change your personal information. Change your password. Change your profile picture.
- **Login** : Login with your email and password. Or login with your Google account.
- **Register** : Register with your email and password. Or register with your Google account.
- **Google Register & Login** : Register and Login with your Google account. Cookie storage required.
- Footer, Pagination : Basic UI components. Reused throughout.
- **Problems** : The meat and bone of this web application. Do problems and practice and get better! Multiple database that contain suitable (reasonable) structure of problems are all supported.
- Handle Manager : Register some users' handles so you can better track them, for competition, education, for fun, etc.

## Firebase API Overview
- Authentication : Register, Login, Logout, Change Password, Change Email, Change Profile Picture
- Storage : Store user's profile picture
- Firestore : Store user's information, training plans, training plan details, problems, problem details, etc.
- Hosting : Host the web application

## Authentication Method
- Email & Password
- Google Account
- More to come...

## Functionalities & Use Cases
Prospectives:
    - Normal User:
        - Sign up, sign in and have the website record your data and progress
        - View training plans and training plan details, create a plan and follow along, or share or see others
        - View problems and problem details, do problems and practice and get better
        - View other users' profiles and see their training plans and problems
        - Change your personal information, change your password, change your profile picture
    - Website Admin:
        - Manage users, manage training plans, manage problems
        - Manage training plan details, manage problem details
        - Manage user's personal information, manage user's password, manage user's profile picture
        - See website statistics, see website usage, see website traffic using Firebase

## Additional Notes about Design

We decided to use Firebase and firebase hosting out of several reasons after a long-winded and multi-round discussion and thinking. The problems we are trying to retrieve are in a certain sense pertinent to be compared to financial data transferred between enterprise-level security systems in that they are volatile, sensitive and constantly change and always there is new incoming flow that the program must deal with on the split seconds of decision. We decided to make all the architecture float in the cloud using Firebase (which in turn commands and utilizes several facets of express js and even next.js) and its hosting & storage capabilities. Each instance of problem a user or admin wants to manipulate becomes an entity that does not require user—or whoever decided to self-host this thing—to worry about 1) cost of API usage to the coding problem source website and 2) whether someone has already posted a solution better than the one you currently am working on, before refreshing the page. In the competition component, things get even worse, as in that specific setting, even a microsecond could mean the difference 1st place and 2nd place. And to download all problems for instant-speed in local application server is too much in terms of bandwidth of API access.

------

## TODOs

- [x] Create Presentation Materials
- [ ] Support Import Function for Plans
- [x] Mobile fitting
- [x] Training Plans Pagination
- [x] Change title
- [ ] Refresh home page the proper way


