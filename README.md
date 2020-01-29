# Signature

# API Documentation
https://documenter.getpostman.com/view/10099542/SWLmWPF7?version=latest

# node_modules
This folder contains all the installed node modules.  
We have installed  
1)express
```
npm i express
```  
2)body-parser
```  
npm i body-parser
```  
3)mongoose
```
npm i mongoose
```  
4)Client-Sessions
```
npm i client-sessions
```  
5)Ejs
```
npm i ejs
```  
# public
  This folder contains all the static images.  
# views
  This folder contains all the front-end pages where the user interacts.
  - `register.ejs` :
      This file is used to register a new user into the applicatoin.
  - `login.ejs`:
      This file displays the login page where user can login using their credentials.
  - `home.ejs`:
      This file displays chatbot page where user can ask their queries.
  - `History.ejs`:
      This file displays all the chatbot history based on the selected date.
# App.js
  This is the main source code which connects all the files
# EmployeeSchema.js
  This contains the Employee Schema to store in the database.
  
# Steps to run the application
1)You need to install NodeJs on your system.  
2)Put the files in a folder and open that folder in your IDE.  
3)You can run the application by running the command on your IDE terminal.  
```
nodemon App.js
```
4)After that you can access the application with the URL.
```
http://127.0.0.1:3001/
```

5)Login page will be displayed where you can login using the sample data  
*********************  
Employee-id :: emp1  
Password    :: 1234  
*********************  
Thank you.
