const express = require('express');
const router = express.Router();
const db = require('../db');
const path = require('path');

router.post('/', async (req,res,next) => {
        try {
            console.log(req.body);
            let name = req.body.name;
            let phoneNo = req.body.phoneNo;
            let email = req.body.email;
            let password = req.body.password;
            const query = `INSERT INTO Roommates (name, phoneno, email, password)` +
                ` VALUES ('${name}', '${phoneNo}', '${email}', '${password}') RETURNING userid`;
            let result = await db.one(query);
            res.status(200).send(result);
            // next();
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
    .get('/', async (req,res) => {
        res.sendFile(path.join(__dirname, '../public', 'signup.html'));
    });

module.exports = router;