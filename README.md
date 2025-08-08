# Starter Repository for Assignment
You are required to build your folder structures for your project.

# Folder Structure
(https://github.com/ST0503-BED/bed-ca2-ZannLee)        
├─ src                       
│  ├─ configs                
│  │  ├─ createSchema.js     
│  │  └─ initTables.js       
│  ├─ controllers            
│  │  ├─ reportsController.js  
│  │  ├─ userController.js
│  │  ├─ userRankController.js
│  │  └─ vulnerabilitiesController.js 
│  ├─ models                 
│  │  ├─ badgeModel.js       
│  │  ├─ reportsModel.js       
│  │  ├─ userModel.js       
│  │  ├─ userRankModel.js       
│  │  └─ vulnerabilitiesModel.js       
│  ├─ routes                 
│  │  ├─ mainRoutes.js       
│  │  ├─ reportsRoutes.js     
│  │  ├─ userRankRoutes.js     
│  │  ├─ userRoutes.js      
│  │  └─ vulnerabilitiesRoutes.js      
│  ├─ services               
│  │  └─ db.js               
│  └─ app.js   
├─ .env     
├─ .gitignore                 
├─ index.js                  
├─ package.json
├─ package-lock.json           
└─ README.md 

Features
- User system with reputation points
- Vulnerability types with point values
- Submit reports and gain points
- Automated badge awards for report types
- Rank system based on reputation
- SQL schema with seeded sample data

Tech Stack
- nodemon
- express
- mysql2
- dotenv

Installation
- Clone the Repository
ctrl + shift + p
git clone https://github.com/ST0503-BED/bed-ca1-ZannLee.git

- Install Dependencies
npm install nodemon express mysql2 dotenv

- Initialise
npm init 

Create SQL Tables
- npm run init_tables

Start the Express server:
npm run dev
By default, it runs on: http://localhost:3000

Doing the Questions
Section A:
1. POST /users 
2. GET /users 
3. GET /users/{id}
4. PUT /users/{id}
5. POST / vulnerabilities (admin)
6. GET /vulnerabilities ✅
7. POST /reports ✅
8. PUT /reports/{report_id} ✅

Section B:
1. GET /users/{id}/badges 
1. GET /users/{id}/rank