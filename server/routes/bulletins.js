const express = require('express');
const router = express.Router();
const db = require('../db');

const url = "http://localhost:3000/bulletins/";

router
    .get('/:assignedTo', async (req,res) => {
        try {
            const query = `SELECT * FROM Bulletin_isCreatedBy WHERE assignedTo = ${req.params.assignedTo}`;
            let result = await db.any(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    .post('/', async (req,res) => {
        const dateCreated = new Date(Date.now()).toISOString();
        try {
            const query = `INSERT INTO Bulletin_isCreatedBy (title, body, dateCreated, createdBy, assignedTo)` +
                `VALUES ('${req.body.title}', '${req.body.body}', '${dateCreated}', '${req.body.createdBy}', '${req.body.assignedTo}')` +
                `RETURNING bID;`;
            let result = await db.any(query);
            console.log(result[0].bid);
            res.status(200).send("http://localhost:3000/contacts/" + result[0].bid);
        } catch (e) {
            console.log(e);
            res.status(400).send(e.message);
        }
    })
    .delete('/:bID', async (req,res) => {
        try {
            const query = `DELETE FROM Bulletin_isCreatedBy WHERE bID = ${req.params.bID} RETURNING *`;
            let result = await db.one(query);
            res.status(200).json(result);
        } catch (e) {
            console.log(e);
            res.status(400).send(e.message);
        }
    })
    .put('/:bID', async (req,res) => {
        try {
            const query = `UPDATE Bulletin_isCreatedBy SET 
                title = '${req.body.title}',
                body = '${req.body.body}', createdBy = '${req.body.createdBy}',
                assignedTo = '${req.body.assignedTo}' ` + `WHERE bID = '${req.params.bID}' RETURNING *`;
            result = await db.any(query);
            res.status(200).json(result);
        } catch (e) {
            console.log(e);
            res.status(400).send(e.message);
        }
    });

module.exports = router;