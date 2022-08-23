DESCRIPTION:
Our project is built by separating the front and back ends, the front end uses the Vue framework, and the back end uses the express framework. The front end uses Vue because of component programming, each page is an independent component, located under src/component. The backend uses the express framework because it is lightweight, and only one file is needed to connect to the database and build routes to send data.

INSTALLATION:
step1. Download the source file from GitHub
https://github.com/giraffecat/CSE6242.git

step2. Install npm and node.js
here are detailed installation descriptions:
https://phoenixnap.com/kb/install-node-js-npm-on-windows

step3. Install dependencies
1. Install front-end dependencies
Frontend dependencies are already configured, so just run
cd frnotend
npm install
2. Install back-end dependencies
The backend needs to install express and mysql
cd backend
npm install mysql
npm install express

step4. Run database file
At MySQL command line mysql> 
mysql> source CSE6242.sql

step5. Configurate database
In server.js file
change user and password to your own database user and password
user     : 'name',
password : 'password',

EXECUTION:
1. Run front-end 
cd frontend 
npm run serve

2. Run back-end
cd backend
node server.js
