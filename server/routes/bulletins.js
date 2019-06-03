const express = require('express');
const router = express.Router();
const db = require('../db');

const url = "http://localhost:3000/bulletins/";

router
    .get('/', async (req,res) => {
        res.status(200).send("This is some boiler plate code");
    });

module.exports = router;