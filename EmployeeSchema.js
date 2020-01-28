var mongoose = require('mongoose');
var EmployeeDB =new mongoose.Schema({
    empid :{
        type : String
    },
    name :{
        type : String
    },
    password :{
        type : String
    },
    email :{
        type : String
    },
    contactno :{
        type : String
    }
})
mongoose.model('EmployeeDB',EmployeeDB);
