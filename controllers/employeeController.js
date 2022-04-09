const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const validator = require('validator');
// const Employee = require('../models/employee.model');

router.get('/',(req, res) => {
    res.render('employee/addOrEdit', {
        viewTitle: "Insert Employee"
    });
})

//employee model 
var employeeSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: 'This field is required.'
    },
    email:{
        type: String,
        required: 'This field is required.',
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid.');
            }
        }
    },
    mobile:{
        type: String,
        required: 'This field is required.',
        minlength: [10, 'Mobile number must be of 10 digits.'],
        maxlength: [10, 'Mobile number must be of 10 digits.']
    },
    city:{
        type: String,
        required: 'This field is required.'

    }
});

var Employee = mongoose.model('Employee', employeeSchema);
router.post('/',(req, res) => {

     if (req.body._id == '')
       { var item = {
            fullName: req.body.fullName,
            email: req.body.email,
            mobile: req.body.mobile,
            city: req.body.city
        };
        console.log(item);
        Employee.create(item, (err, result) => {
            if(!err){
                res.redirect('employee/list');
            }
            else{
                if(err.name == 'ValidationError'){
                    handleValidationError(err, req.body); 
                    res.render('employee/addOrEdit', {
                        viewTitle: "Insert Employee",
                        employee : req.body
                    });
                }
                else{
                console.log("Error in inserting data : " + err);}
            }
        });
    }   else{
        Employee.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, doc) => {
            if(!err){res.redirect('/employee/list');}
            else{
                if(err.name == "ValidationError"){
                    handleValidationError(err, req.body);
                    res.render('employee/addOrEdit', {
                        viewTitle: "Update Employee",
                        employee: req.body
                    });
                }else{
                    console.log("Error in updating data : " + err);
                }
            }
        });
    }
});


router.get('/list',(req, res) => {
    Employee.find((err,docs)=>{
        if(!err){
            res.render('employee/list', {
                list: docs
            });
        }else{
            console.log('Error in retrieving employee list : ' + err);
        }
    }).lean();
});

function handleValidationError(err, body){
    for(field in err.errors){
        switch(err.errors[field].path){
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            case 'mobile':
                body['mobileError'] = err.errors[field].message;
                break;  
            case 'city':
                body['cityError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id',(req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if(!err){
            res.render('employee/addOrEdit', {
                viewTitle: "Update Employee",
                employee: doc
            });
        }
    }).lean();
});

router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if(!err){
            res.redirect('/employee/list');
        }
        else{
            console.log('Error in employee delete : ' + err);
        }
    }).lean();
})
 
module.exports = router;