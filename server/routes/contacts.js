var express = require('express');
var router = express.Router();
const db = require('../db');


router
    /* GET contacts listing based on householdID. */
    .get('/houses/:houseID', async function(req, res, next) {
        try {
          const query1 = `CREATE OR REPLACE VIEW ContactsByHouseID AS
          SELECT * FROM Contacts
          INNER JOIN (SELECT * FROM Household_Roommates WHERE 
            Household_Roommates.houseID = ${req.params.houseID}) AS derivedTable
          ON derivedTable.roommateID = Contacts.listedBy`;

          const query2 = `SELECT c.contactsid, c.name, c.phoneno, c.relationship, c.listedby, r.name as listedbyname FROM ContactsByHouseID c, roommates r where c.listedby = r.userid order by c.name`;
          await db.any(query1);
          let result = await db.any(query2);
          res.status(200).json(result);
      } catch (e) {
          res.status(400).send(e.message);
      }
      })

    /* GET contact based on contactsid. */
    .get('/:contactsID', async (req,res) => {
        try {
            const query = `SELECT * FROM Contacts WHERE contactsID = ${req.params.contactsID}`;
            let result = await db.any(query);
            res.status(200).json(result);
        } catch (e) { 
            res.status(400).send(e.message);
        }
    })

    /* ADDS new contact */
    .post('/', async (req,res) => {
        console.log("HI"+JSON.stringify(req.body));
        try {
            const query = `INSERT INTO Contacts (name, phoneNo, relationship, listedBy)` +
                `VALUES ('${req.body.name}', '${req.body.phoneNo}', '${req.body.relationship}', '${req.body.listedby}')` +
                // `VALUES ('adele', '123456', 'father', '1')` + /* FOR TESTING */
                `RETURNING contactsID;`;
            let result = await db.any(query);
            console.log(result[0].contactsid);
            res.status(200).send({cid:result[0].contactsid});
            // res.status(200).send("http://localhost:3000/contacts/" + result[0].contactsid);
        } catch (e) {
            console.log(e);
            res.status(400).send(e.message);
        }
    })

    /* deletes contact based on contactsid */
    .delete('/:contactsID', async (req,res) => {
            try {
                const query = `DELETE FROM Contacts WHERE contactsID = ${req.params.contactsID} RETURNING *`;
                let result = await db.one(query);
                res.status(200).json(result);
            } catch (e) {
                console.log(e);
                res.status(400).send(e.message);
            }
    })
    
    /* updates contact for one or more of the attributes */
    .put('/:contactsID', async (req,res) => {
            try {
                const query = `UPDATE Contacts SET 
                    name = '${req.body.name}',
                    phoneNo = '${req.body.phoneNo}', relationship = '${req.body.relationship}',
                    listedBy = '${req.body.listedby}' ` + `WHERE contactsid = '${req.params.contactsID}' RETURNING *`;
                result = await db.any(query);
                res.status(200).json(result);
            } catch (e) {
                console.log(e);
                res.status(400).send(e.message);
            }
  });

module.exports = router;
