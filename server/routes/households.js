var express = require('express');
var router = express.Router();
const db = require('../db');
const url = "http://localhost:3000/households/";

router
    /**
     * Gets all household URIs relevant to the user
     */
    .get("/", async (req,res) => {
        try {
            const query = `select houseid from households right join household_roommates using (houseid) where roommateid = ${req.user}`;
            console.log(query);
            let result = await db.any(query);
            result = result.map((value) => {
                let id = value.houseid;
                return "/households/" + id;
            });
            res.status(200).send(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * Creates a new household
     */
    .post("/", async (req,res) => {
        try {
            const query1 = `INSERT INTO Households (address, name ) VALUES ('${req.body.address}','${req.body.name}') RETURNING houseID`;
            let result = await db.one(query1);
            result = url + result.houseid;
            console.log("HI "+result.houseid);
            res.status(200).send(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * get the specifics of a household with ID houseID
     */
    .get("/:houseID", async (req, res) => {
        try {
            const query = `SELECT * FROM Households WHERE houseID = ${req.params.houseID}`;
            let result = await db.one(query);
            if (!result) res.status(204);
            else res.status(200);
            res.json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * Update the address of a household with ID houseID
     */
    .patch("/:houseID", async (req, res) => {
        try {
            const query = `UPDATE Households SET address = '${req.body.address}' WHERE houseID = ${req.params.houseID} RETURNING *`;
            let result = await db.any(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * Delete a household
     */
    .delete('/:houseID', async (req, res) => {
        try {
            const query = `DELETE FROM Households WHERE houseID = ${req.params.houseID} RETURNING houseID`;
            let result = await db.any(query);
            if (!result || result.length !== 1) res.status(204);
            else res.status(200);
            res.send();
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * Get the userIDs of all the roommates in a given household
     */
    .get('/:houseID/roommates', async (req, res) => {
        try {
            const query = `SELECT roommateID FROM Household_Roommates WHERE houseID = ${req.params.houseID}`;
            let result = await db.any(query);
            if (!result || result.length === 0) res.status(204);
            else res.status(200);
            res.json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * Add a roommate to the given household
     */
    .post('/:houseID/roommates/:roommateID', async (req, res) => {
        try {
            const query = `INSERT INTO Household_Roommates VALUES (${req.params.houseID}, ${req.params.roommateID})`;
            await db.any(query);
            res.status(200).send();
        } catch (e) {
            if (e.message.indexOf("duplicate") !== -1) res.status(409).send(e.message);
            else res.status(400).send(e.message);
        }
    })
    /**
     * Remove the specified roommate from the given household
     */
    .delete('/:houseID/roommates/:roommateID', async (req, res) => {
        try {
            const query =
                `DELETE FROM Household_Roommates WHERE houseID = ${req.params.houseID} AND roommateID = ${req.params.roommateID} RETURNING *`;
            console.log(query);
            let result = await db.one(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * Get the rooms of the specified house
     */
    .get('/:houseID/rooms', async (req, res) => {
        try {
            const query = `SELECT * FROM Rooms WHERE houseID = ${req.params.houseID}`;
            let result = await db.any(query);
            if (!result || result.length === 0) res.status(204);
            else res.status(200);
            res.json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * Add a room of a given name to the specified house
     */
    .post('/:houseID/rooms/:roomName', async (req, res) => {
        try {
            const query = `INSERT INTO Rooms VALUES (${req.params.houseID}, '${req.params.roomName}')`;
            await db.any(query);
            res.status(200).send();
        } catch (e) {
            if (e.message.includes('duplicate')) res.status(409).send(e.message);
            else res.status(400).send(e.message);
        }
    })
    /**
     * Remove a room of the specified name from the house of the specified id
     */
    .delete('/:houseID/rooms/:roomName', async (req, res) => {
        try {
            const query =
                `DELETE FROM Rooms where houseID = ${req.params.houseID} AND roomName = '${req.params.roomName}' RETURNING *`;
            let result = await db.any(query);
            if (!result || result.length === 0) res.status(204);
            else res.status(200);
            res.json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    });

module.exports = router;
