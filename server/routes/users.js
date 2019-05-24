var express = require('express');
var router = express.Router();
const db = require('../db');

/* GET users listing. */
router.get('/', async function(req, res, next) {
    res.send("Connection accomplished!");

});

module.exports = router;
