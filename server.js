const express = require("express");
const employeeController = require("./controllers/employeeController");
const path = require("path");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const {engine} = require("express-handlebars");
const mongoose = require("mongoose");
require('dotenv/config');
const port = process.env.PORT || 8000;


var app = express();

//DB connection
mongoose.connect(   
    "mongodb+srv://BHARDWAJ:YhnYmJXjGnvXgxAN@cluster0.voeu8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", 
    ()=> console.log('Connected to DB')
);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//express-handlebars
app.engine("handlebars", engine({ defaultLayout: "main" }));
app.engine('hbs', engine({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');

app.listen(port,() => {
    console.log(`Server started at port ${port}`);
});

app.get("/", (req, res) => {
    res.send("Welcome To My Node.js App");
})

app.use('/employee', employeeController);