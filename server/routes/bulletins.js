const express = require('express');
const router = express.Router();
const db = require('../db');

const url = "http://localhost:3000/bulletins/";

router
    .get('/:assignedTo', async (req,res) => {
        try {
            const query = `SELECT bid, title, body, datecreated, createdby, assignedto, name FROM Bulletin_isCreatedBy, Roommates WHERE Bulletin_isCreatedBy.createdby = Roommates.userid AND assignedTo = ${req.params.assignedTo} order by datecreated desc`;
            let result = await db.any(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    .post('/', async (req,res) => {
        try {
            const query = `INSERT INTO Bulletin_isCreatedBy (title, body, dateCreated, createdBy, assignedTo)` +
                `VALUES ($$ ${req.body.title} $$, $$ ${req.body.body} $$, current_timestamp, '${req.body.createdby}', '${req.body.assignedto}')` +
                `RETURNING bid`;
            let result = await db.one(query);
            console.log(result);
            const query2 =  `SELECT bid, title, body, datecreated, createdby, assignedto, name FROM Bulletin_isCreatedBy, Roommates WHERE Bulletin_isCreatedBy.createdby = Roommates.userid AND bid = ${result.bid}`;
            let finalResult = await db.one(query2);
            res.status(200).json(finalResult);
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