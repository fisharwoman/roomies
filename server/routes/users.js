var express = require('express');
var router = express.Router();
const db = require('../db');

/* GET users listing. */
router
    .get('/', async function(req, res, next) {
        try {
            const query = "SELECT userID FROM Roommates";
            let result = await db.any(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send("Bad request");
        }
    })
    .get('/:userID', async (req,res) => {
        try {
            const query = `SELECT * FROM Roommates WHERE userID = ${req.params.userID}`;
            let result = await db.any(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    });

module.exports = router;
