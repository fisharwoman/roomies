/**
 * Valid expense query
 * body :{
 *     startDate: string,
 *     endDate: string,
 *     amount: {
 *         operation: 'GT'|'LT'|'EQ',
 *         value: number
 *     },
 *     types: number[],
 *     categories: number[]
 * }
 */

const aggreateOperators = ["count", "sum", "avg", "max", "min"];
const amountOperators = ['GT','LT','EQ'];


const QueryUtil = {};

/**
 * Get all expenses that fall under a certain number of expenses
 * @param req = {
 *     startDate?: string,
 *     endDate?: string,
 *     amount?: {
 *         operation: 'GT'|'LT'|'EQ',
 *         value: number
 *     },
 *     types?: number[],
 *     categories?: number[]
 * }
 */
QueryUtil.makeUserExpenseQuery = function(req) {
    let user = req.userID;
    let query = `SELECT * FROM expenses_with_categories WHERE createdBy = ${user}`;
    query = makeExpenseQuery(req, query);
    return query;
};

QueryUtil.makeHouseholdExpenseQuery = function(req) {
    let houseID = req.houseID;
    let query = `SELECT * FROM expenses_with_categories WHERE houseID = ${houseID}`;
    query = makeExpenseQuery(req,query);
    return query;
};


/**
 * Performs aggregation summary
 * @param req = {
 *     aggregation: 'sum'|'avg'|'count'|'max'|'min',
 *     groupBy?: string[],
 *     startDate?: string,
 *     endDate?: string,
 *     amount?: {
 *         operator: 'GT'|'LT'|'EQ',
 *         value: number
 *     }
 * }
 */
QueryUtil.makeUserExpenseSummary = function(req) {
    let user = req.userID;
    let aggregator = req.aggregation;
    let groupBy = req.groupBy;
    if (!aggreateOperators.includes(aggregator)) throw new Error('Invalid aggregate operator has been passed');
    let query = 'SELECT';
    if (groupBy) query = query + ` ${groupBy.toString()},`;
    query = query + ` ${aggregator}(amount::numeric) from expenses_with_categories WHERE createdBy = ${user}`;
    query = makeExpenseSummary(req, query);
    return query;
};

QueryUtil.makeHouseholdExpenseSummary = function(req) {
    let houseID = req.houseID;
    let aggregator = req.aggregation;
    let groupBy = req.groupBy;
    if (!aggreateOperators.includes(aggregator)) throw new Error('Invalid aggregate operator has been passed');
    let query = 'SELECT';
    if (groupBy) query = query + ` ${groupBy.toString()},`;
    query = query + ` ${aggregator}(amount::numeric) from expenses_with_categories WHERE houseID = ${houseID}`;
    query = makeExpenseSummary(req, query);
    return query;
};


function getAmountOperator(amount) {
    if (amount.operator === 'GT') {
        return `> '${amount.value}'`;
    } else if (amount.operator === 'LT') {
        return `< '${amount.value}'`;
    } else if (amount.operator === 'EQ') {
        return `== '${amount.value}'`;
    } else {
        throw new Error("Invalid operator passed to filter by amount");
    }
}

function makeExpenseQuery(req, query) {
    if (req.startDate) query = query + ` AND expenseDate >= '${req.startDate}'`;
    if (req.endDate) query = query + ` AND expenseDate <= '${req.endDate}'`;
    if (req.amount) query = query + " AND amount "+ getAmountOperator(req.amount);
    if (req.types) {
        let typeValues = req.types.toString();
        query = query + ` AND expensetypeid IN (${typeValues})`;
    }
    if (req.categories) {
        let categoryValues = req.categories.toString();
        query = query + ` AND category IN (${categoryValues})`;
    }
    return query;
}

function makeExpenseSummary(req, query) {
    let groupBy = req.groupBy;
    if (req.startDate) query = query + ` AND expenseDate >= ${req.startDate}`;
    if (req.endDate) query = query + ` AND expenseDate <= ${req.endDate}`;
    if (req.amount) query = query + ' AND amount ' + getAmountOperator(req.amount);
    if (groupBy) query = query + ` GROUP BY ${groupBy.toString()}`;
    return query;
}

module.exports = QueryUtil;
