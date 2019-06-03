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
    .post('/', async (req,res) => {
        try {
            const query = `INSERT INTO Roommates (name, phoneNo, password, email)` +
                ` VALUES ('${req.body.name}', '${req.body.phoneNo}', '${req.body.password}', '${req.body.email}')` +
                `RETURNING userID;`;
            let result = await db.any(query);
            res.status(200).send("http://localhost:3000/" + result[0].userid);
        } catch (e) {
            console.log(e);
            res.status(400).send(e.message);
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
    })
    .delete('/:userID', async (req,res) => {
        try {
            const query = `DELETE FROM Roommates WHERE userID = '${req.params.userID}'`;
            await db.any(query);
            res.status(200).send();
        } catch (e) {
            console.log(e);
            res.status(400).send(e.message);
        }
    })
    .put('/:userID', async(req,res) => {
        try {
            const query = `UPDATE Roommates SET name = '${req.body.name}', phoneNo = '${req.body.phoneNo}', password = '${req.body.password}',`+
                ` email = '${req.body.email}' WHERE userID = ${req.params.userID} RETURNING userID, name, phoneNo, email`;
            console.log(query);
            let result = await db.any(query);
            res.status(200).json(result);
        } catch (e) {
            console.log(e);
            res.status(400).send(e.message);
        }
    });

module.exports = router;
