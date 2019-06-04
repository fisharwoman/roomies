const express = require('express');
const router = express.Router();
const db = require('../db');

const url = "http://localhost:3000/expenses/";

router
    .post('/expense', async (req, res) => {
        try {
            const query = `INSERT INTO Expenses (expenseDate, amount, description, createdBy, expenseType, houseID)`+
                `VALUES ('${req.body.expenseDate}','${req.body.amount}','${req.body.description}',` +
                `${req.body.createdBy},${req.body.expenseType},${req.body.houseID}) RETURNING expenseID`;
            let result = await db.any(query);
            result = url + "expense/" + result[0].expenseid;
            res.status(200).send(result);

        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * Get the expense with the specified ID
     */
    .get("/expense/:expenseID", async (req, res) => {
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
    .delete('/expense/:expenseID', async (req, res) => {
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
     * Update one or more attributes of specified expense
     */
    .patch('/expense/:expenseID', async (req, res) => {
        try {
            const query =
                `UPDATE Expenses SET expenseDate = '${req.body.expenseDate}', amount = '${req.body.amount}', description = '${req.body.description}',`+
                ` createdBy = ${req.body.createdBy}, expenseType = ${req.body.expenseType}, houseID = ${req.body.houseID}`+
                ` WHERE expenseID = ${req.params.expenseID} RETURNING *`;
            let result = await db.any(query);
            if (!result || result.length === 0) res.status(204);
            else res.status(200);
            res.json(result);
        } catch (e) {
            console.log(e);
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
                return url + "expense/" +value.expenseid;
            });
            res.status(200).json(result);
        } catch (e) {
            res.status(200).send(e.message);
        }
    })
    /**
     * Get all partial expenses for the specified expense
     */
    .get('/splits/:expenseID', async (req, res) => {
        try {
            const query = `SELECT expenseID, borrower FROM PartialExpenses WHERE expenseID = ${req.params.expenseID}`;
            let result = await db.any(query);
            result = result.map((value) => {
                return url + "splits/" + value.expenseid + "/" + value.borrower;
            });
            res.status(200).json(result);
        } catch (e) {
            res.status(200).send(e.message);
        }
    })
    /**
     * Splits an expense into partial expenses
     * body: {
     *     roommateProportions: [{roommateID: integer, proportion: number}]
     *     date: string
     * }
     */
    .post('/splits/:expenseID', async (req, res) => {
        try {
            let roommateProportions = req.body.roommateProportions;
            let expenseID = req.params.expenseID;
            let expense = await db.one(`SELECT createdBy, amount::numeric FROM Expenses WHERE expenseID = ${expenseID}`);
            let loaner = expense.createdby;
            let totalCost = expense.amount;
            let date = req.body.date;
            await db.tx(t => {
               roommateProportions = roommateProportions.map((value) => {
                   let splitCost = calculateSplitCost(totalCost, value.proportion);
                   const query = `INSERT INTO PartialExpenses VALUES (${expenseID}, ${loaner}, ${value.roommateID}, `+
                       `'${splitCost}', '${date}', null)`;
                   return t.none(query);
               });
               return t.batch(roommateProportions);
            });
            res.status(200).send();
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * Get a partial expense
     */
    .get('/splits/:expenseID/:borrowerID', async(req,res) => {
        try {
            const query =
                `SELECT * FROM PartialExpenses WHERE expenseID = ${req.params.expenseID} AND borrower = ${req.params.borrowerID}`;
            let result = await db.any(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * Get all expense type URIs
     */
    .get('/types', async (req, res) => {
        try {
            const query = "SELECT expenseTypeID from ExpenseTypes";
            let result = await db.any(query);
            result = result.map(values => {
                return url + "types/" + values.expensetypeid;
            });
            res.status(200).json(result);
        } catch (e) {
            res.status(200).send(e.message);
        }
    })
    /**
     * Adds an expense type
     * body: {
     *     description: string,
     *     category: number
     * }
     */
    .post('/types', async (req,res) => {
        try {
            const query = `INSERT INTO ExpenseTypes (description, category) `+
                `VALUES ('${req.body.description}', '${req.body.category}') RETURNING expenseTypeID`;
            let result = await db.one(query);
            result = url + "types/" + result.expensetypeid;
            res.status(200).send(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * Gets the specified expense type
     */
    .get("/types/:typeID", async (req, res) => {
        try {
            const query = `SELECT * FROM ExpenseTypes WHERE expenseTypeID = ${req.params.typeID}`;
            let result = await db.one(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * Gets the expense category URIs
     */
    .get('/categories', async (req, res) => {
        try {
            const query = `SELECT categoryID FROM ExpenseCategories`;
            let result = await db.any(query);
            result = result.map((value) => {
                return url + "categories/" + value.categoryid;
            });
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * Adds a category and returns the new URI
     * body :{
     *     description: string
     * }
     */
    .post('/categories', async (req, res) => {
        try {
            const query = `INSERT INTO ExpenseCategories (description) VALUES ('${req.body.description}') RETURNING categoryID`;
            let result = await db.one(query);
            result = url + "categories/" + result.categoryid;
            res.status(200).send(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * Get the specified expense category
     */
    .get('/categories/:categoryID', async (req, res) => {
        try {
            const query = `SELECT * from ExpenseCategories WHERE categoryID = ${req.params.categoryID}`;
            let result = await db.one(query);
            res.status(200).send(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * replaces the specified category ID with the one provided in the description
     * body: {
     *     description: string
     * }
     */
    .put('/categories/:categoryID', async (req, res) => {
        try {
            const query = `UPDATE ExpenseCategories SET description = '${req.body.description}' `+
                `WHERE categoryID = ${req.params.categoryID} RETURNING *`;
            let result = await db.one(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    });

function calculateSplitCost(totalCost, proportion) {
    return totalCost * proportion;
}

module.exports = router;