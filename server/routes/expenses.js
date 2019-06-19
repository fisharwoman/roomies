const express = require('express');
const router = express.Router();
const db = require('../db');
const QueryUtil = require('./res/ExpenseQueryUtil');
const url = "http://localhost:3000/expenses/";

router
    .post('/expense', async (req, res) => {
        try {
            const query = `INSERT INTO Expenses (expenseDate, amount, description, createdBy, expenseType, houseID)`+
                `VALUES ('${req.body.expenseDate}','${req.body.amount}','${req.body.description}',` +
                `${req.body.createdBy},${req.body.expenseType},${req.body.houseID}) RETURNING *`;
            let result = await db.one(query);
            res.status(200).json(result);

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
     * Pay a partial expense
     */
    .patch('/expense/splits/pay/:expenseID/:userID', async (req, res) => {
        try {
            const query = `UPDATE PartialExpenses SET datepaid=CURRENT_TIMESTAMP WHERE expenseid = ${req.params.expenseID} AND borrower=${req.params.userID} RETURNING datepaid`;
            let result = await db.one(query);
            console.log('done');
            res.status(200).json(result);
        } catch (e) {
            console.log(e.message);
            res.status(400).send();
        }
    })
    /**
     * Get all the expenses tied to the specified household ID
     */
    .get('/households/:houseID', async (req, res) => {
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
     * Get all the expenses in the specified household created by the given user
     */
    .get('/households/:houseID/users/:userID', async (req,res) => {
        try {
            const query = `SELECT * FROM expenses WHERE createdby = ${req.params.userID} AND houseid = ${req.params.houseID}`;
            console.log(query);
            const response = await db.any(query);
            res.status(200).json(response);
        } catch (e) {
            console.log(e.message);
            res.status(400).send(e.message);
        }
    })
    
    /**
     * Get all partial expenses for the specified expense
     */
    .get('/splits/:expenseID', async (req, res) => {
        try {
            const query = `SELECT p.borrower, p.amount, p.datepaid, r.name FROM PartialExpenses p, Roommates r WHERE p.borrower = r.userID AND p.expenseID = ${req.params.expenseID}`;
            let result = await db.any(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(200).send(e.message);
        }
    })
    .get('/splits/borrower/:userID', async (req,res) => {
        try {
            const query = `SELECT * FROM (SELECT * FROM partialexpenses inner join ` +
            `(select expenseid, description, expensetype from expenses) as foo using (expenseid)) as tbl, (select userid, name as lendername from roommates) as r ` +
            `WHERE tbl.borrower=${req.params.userID} and tbl.lender = r.userid`;
            const response = await db.any(query);
            res.status(200).json(response);
        } catch (e) {
            console.log(e.message);
            res.status(400).send(e.message);
        }
    })
    /* Gets the total amount owed */
    .get('/splits/borrower/:userID/total', async (req, res) => {
        try {
            const query = `select sum(amount) as total from partialexpenses where borrower=${req.params.userID}  and datepaid is null`;
            const response = await db.one(query);
            res.status(200).json(response);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    .get('/splits/household/:houseID/borrower/:userID', async (req,res) => {
        try {
            const query = `SELECT * FROM (SELECT * FROM partialexpenses inner join ` +
                `(select expenseid, description, expensetype, houseid from expenses) as foo using (expenseid)) as tbl, (select userid, name as lendername from roommates) as r ` +
                `WHERE tbl.borrower=${req.params.userID} and tbl.lender = r.userid and tbl.houseid=${req.params.houseID}`;
            const response = await db.any(query);
            res.status(200).json(response);
        } catch (e) {
            console.log(e.message);
            res.status(400).send(e.message);
        }
    })
    
    /* Gets the total amount owed */
    .get('/splits/household/:houseID/borrower/:userID/total', async (req, res) => {
        try {
            const query = `select sum(p.amount) as total from partialexpenses p, expenses e where p.expenseid = e.expenseid and e.houseid=${req.params.houseID} and p.borrower=${req.params.userID}  and p.datepaid is null`;
            const response = await db.one(query);
            res.status(200).json(response);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    // TODO: CHECK IF IS THIS RIGHT
    .get('/splits/lender/:userID', async (req,res) => {
        try {
            const query = `SELECT * FROM (SELECT * FROM partialexpenses inner join ` +
            `(select expenseid, description, expensetype from expenses) as foo using (expenseid)) as tbl ` +
            `WHERE lender=${req.params.userID}`;
            console.log(query);
            const response = await db.any(query);
            res.status(200).json(response);
        } catch (e) {
            console.log(e.message);
            res.status(400).send(e.message);
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
            let remainingCost = totalCost;
            let date = req.body.date;
            await db.tx(t => {
               roommateProportions = roommateProportions.map((value,idx) => {
                   let query;
                   let datepaid = req.user === value.roommateID ? `'${date}'` : 'null';
                   if (idx === roommateProportions.length-1) {
                       query = `INSERT INTO PartialExpenses VALUES (${expenseID}, ${loaner}, ${value.roommateID}, `+
                           `'${remainingCost}', '${date}', ${datepaid})`;
                   } else {
                       let splitCost = calculateSplitCost(totalCost, value.proportion);
                       remainingCost-=splitCost;
                       query = `INSERT INTO PartialExpenses VALUES (${expenseID}, ${loaner}, ${value.roommateID}, `+
                           `'${splitCost}', '${date}', ${datepaid})`;
                   }
                   return t.none(query);
               });
               return t.batch(roommateProportions);
            });
            res.status(200).send();
        } catch (e) {
            console.log(e);
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
            const query = "SELECT t.expensetypeid, t.description as typename, c.description as categoryname from ExpenseTypes t, ExpenseCategories c where t.category=c.categoryid order by c.description, t.description";
            let result = await db.any(query);
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
    })
    /**
     * Apply a search criteria for a user's expenses
     */
    .post('/roommates/:userID/search', async (req,res) => {
        try {
            req.body.userID = req.params.userID;
            const query = QueryUtil.makeUserExpenseQuery(req.body);
            console.log(query);
            let result = await db.manyOrNone(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * Apply an aggregate query to a user's particular expenses
     */
    .post('/roommates/:userID/summary', async (req, res) => {
        try {
            req.body.userID = req.params.userID;
            const query = QueryUtil.makeUserExpenseSummary(req.body);
            console.log(query);
            let result = await db.manyOrNone(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /**
     * Generates a list of the expenses with the columns specified in req.body.cols
     * {cols: [expensedate, amount, expensedescription, createdby, typedescription, categorydescription],houseid: number}
     */
    .post('/roommates/:userID/report', async (req, res) => {
        try {
            let columns = "";
            req.body.cols.forEach((value,idx) => {
                columns+=value;
                if (idx < req.body.cols.length-1) columns+=",";
            });
            console.log(columns);
            const query = `select ${columns} from user_expense_report where createdby = ${req.params.userID} and houseid = ${req.body.houseid}`;
            let response = await db.any(query);
            res.status(200).json(response);
        } catch (e) {
            // console.log(e);
            res.status(400).send(e);
        }
    })
    /**
     * Apply a search query to a household's particular expenses
     */
    .post('/households/:houseID/search', async (req,res) => {
        try {
            req.body.houseID = req.params.houseID;
            const query = QueryUtil.makeHouseholdExpenseQuery(req.body);
            console.log(query);
            let result = await db.manyOrNone(query);
            res.status(200).json(result);
        } catch (e) {
            console.log(e);
            res.status(400).send(e.message);
        }
    })
    /**
     * Apply an aggregate search query to a household's particular expenses
     */
    .post('/households/:houseID/summary', async (req,res) => {
        try {
            req.body.houseID = req.params.houseID;
            const query = QueryUtil.makeHouseholdExpenseSummary(req.body);
            let result = await db.manyOrNone(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /* Gets an aggregate view of expenses made for a particular household, for a particular user*/
    .get('/households/:houseID/roommates/:userID/owed', async (req,res) => {
        try {
            const query = `select e.expenseid, e.description, e.amount, t.outstanding from expenses e, ` +
                `(select e.expenseid, sum(p.amount) as outstanding from expenses e, partialexpenses p ` +
                `where e.expenseid = p.expenseid and p.datepaid is null and e.houseid = ${req.params.houseID}  ` +
                `and e.createdby = ${req.params.userID} group by e.expenseid) as t where e.expenseid = t.expenseid`;
            let response = await db.any(query);
            res.status(200).json(response);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    /* Get the splits a user hasn't paid yet for a particular household*/
    .get('/households/:houseID/roommates/:userID/owing', async (req,res) => {
        try {
            const query = `select e.expenseid, e.description, e.amount, p.amount as outstanding from expenses e, partialexpenses p where `+
                `e.expenseid = p.expenseid and houseid=${req.params.houseID} and p.borrower=${req.params.userID} and p.datepaid is null`;
            let response = await db.any(query);
            res.status(200).json(response);
        } catch (e) {
            res.status(400).send(e.message);
        }
    });

function calculateSplitCost(totalCost, proportion) {
    return totalCost * proportion;
}

module.exports = router;