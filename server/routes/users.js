var express = require('express');
var router = express.Router();
const db = require('../db');

/* GET users listing. */
router.get('/', async function(req, res, next) {
    await db.any("CREATE TABLE IF NOT EXISTS test (id serial PRIMARY KEY, num integer, data varchar);");
    await db.any("INSERT INTO test (num, data) VALUES ($1, $2)", [100, "abcdef"]);
    const ans = await db.any("SELECT * FROM test;");
    res.send(ans);

});

module.exports = router;
