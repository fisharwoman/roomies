const express = require('express');
const router = express.Router();
const db = require('../db');

const url = "http://localhost:3000/expenses/";

router
    .get("/", async (req, res) => {
        res.status(200).send("This is some boilerplate code");
    });

module.exports = router;