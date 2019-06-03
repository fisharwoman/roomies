const express = require('express');
const router = express.Router();
const db = require('../db');

const url = "http://localhost:3000/expenses/";

router
    .post('/', async (req, res) => {
        try {
            const query = `INSERT INTO Expenses (expenseDate, amount, description, createdBy, expenseType, houseID)`+
                `VALUES ('${req.body.expenseDate}','${req.body.amount}','${req.body.description}',` +
                `${req.body.createdBy},${req.body.expenseType},${req.body.houseID}) RETURNING expenseID`;
            let result = await db.any(query);
            result = url + result[0].expenseid;
            res.status(200).send(result);

        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * Get the expense with the specified ID
     */
    .get("/:expenseID", async (req, res) => {
        try {
            const query = `SELECT * FROM Expenses WHERE expenseID = ${req.params.expenseID}`;
            let result = await db.any(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * Remove an expense of the specified ID
     */
    .delete('/:expenseID', async (req, res) => {
        try {
            const query = `DELETE FROM Expenses WHERE expenseID = ${req.params.expenseID} RETURNING *`;
            let result = await db.any(query);
            if (!result || result.length === 0) res.status(204);
            else res.status(200);
            res.send();
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * Get all the expenses tied to the specified household ID
     */
    .get('/household/:houseID', async (req, res) => {
        try {
            const query = `SELECT expenseID FROM Expenses WHERE houseID = ${req.params.houseID}`;
            let result = await db.any(query);
            result = result.map((value) => {
                return url + value.expenseid;
            });
            res.status(200).json(result);
        } catch (e) {
            res.status(200).send(e.message);
        }
    });
module.exports = router;