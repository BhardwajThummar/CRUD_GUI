const express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('employee/home', {
    });
})

module.exports = router;