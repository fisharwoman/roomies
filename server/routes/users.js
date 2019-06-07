var express = require('express');
var router = express.Router();
const db = require('../db');

const url = "http://localhost:3000/users/";
/* GET users listing. */
router
    /**
     * Get all the user resource URIs
     */
    .get('/', async function(req, res, next) {
        try {
            const query = "SELECT userID FROM Roommates";
            let result = await db.any(query);
            result = result.map((value) => {
                return url + value.userid;
            });
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send("Bad request");
        }
    })
    /**
     * add a user to the roommates resource
     */
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
    /**
     * Get the specified user
     */
    .get('/:userID', async (req,res) => {
        try {
            const query = `SELECT * FROM Roommates WHERE userID = ${req.params.userID}`;
            let result = await db.one(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * Remove the specified user
     */
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
    /**
     * Update one or more aspects of the specified user
     */
    .patch('/:userID', async(req,res) => {
        try {
            const query = `UPDATE Roommates SET name = '${req.body.name}', phoneNo = '${req.body.phoneNo}', password = '${req.body.password}',`+
                ` email = '${req.body.email}' WHERE userID = ${req.params.userID} RETURNING userID, name, phoneNo, email`;
            let result = await db.any(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * Get all the households that the specified user is member to
     */
    .get('/:userID/households', async (req, res) => {
        try {
            const query = `SELECT houseID FROM Household_Roommates WHERE roommateID = ${req.params.userID}`;
            let result = await db.any(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    });

module.exports = router;
