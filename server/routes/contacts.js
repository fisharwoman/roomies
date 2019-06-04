var express = require('express');
var router = express.Router();
const db = require('../db');


router
    /* GET contacts listing based on householdID. */
    .get('/houses/:houseID', async function(req, res, next) {
        try {
          const query1 = `CREATE OR REPLACE VIEW ContactsByHouseID AS
          SELECT * FROM Contacts
          RIGHT JOIN (SELECT * FROM Household_Roommates WHERE 
            Household_Roommates.houseID = ${req.params.houseID}) AS derivedTable
          ON derivedTable.roommateID = Contacts.listedBy`;

          const query2 = `SELECT * FROM ContactsByHouseID`;
          await db.any(query1);
          let result = await db.any(query2);
          res.status(200).json(result);
      } catch (e) {
          res.status(400).send(e.message);
      }
      })

    /* GET contact based on contactsid. */
    .get('/:contactsid', async (req,res) => {
        try {
            const query = `SELECT * FROM Contacts WHERE contactsID = ${req.params.contactsid}`;
            let result = await db.any(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })

    /* ADDS new contact */
    .post('/', async (req,res) => {
        try {
            const query = `INSERT INTO Contacts (name, phoneNo, relationship, listedBy)` +
                `VALUES ('${req.body.name}', '${req.body.phoneNo}', '${req.body.relationship}', '${req.body.listedby}')` +
                // `VALUES ('adele', '123456', 'father', '1')` + /* FOR TESTING */
                `RETURNING contactsID;`;
            let result = await db.any(query);
            console.log(result[0].contactsid);
            res.status(200).send("http://localhost:3000/contacts/" + result[0].contactsid);
        } catch (e) {
            console.log(e);
            res.status(400).send(e.message);
        }
    })

    /* deletes contact based on contactsid */
    .delete('/:contactsid', async (req,res) => {
            try {
                const query = `DELETE FROM Contacts WHERE contactsID = ${req.params.contactsid} RETURNING *`;
                let result = await db.one(query);
                res.status(200).json(result);
            } catch (e) {
                console.log(e);
                res.status(400).send(e.message);
            }
    })
    
    /* updates contact for one or more of the attributes */
    .patch('/:contactsid', async (req,res) => {
            try {
                const query = `UPDATE Contacts SET name = ${req.params.name},
                    phoneNo = ${req.params.phoneNo}, relationship = ${req.params.relationship}, 
                    listedBy = ${req.params.listedby} WHERE contactsid = ${req.params.contactsid} RETURNING contactsid, name, phoneNo, relationship, listedBy`;
                    // const query = `UPDATE Contacts SET name = 'john legend',
                    //     phoneNo = '12345', relationship = 'brother', listedBy = 2 WHERE contactsid = ${req.params.contactsid} 
                    //     RETURNING contactsid, name, phoneNo, relationship, listedBy`;
                result = await db.any(query);
                res.status(200).send( 'Following contactID ' + `${req.params.contactsid}` + 
                    ' updated:\n' + JSON.stringify(result));
            } catch (e) {
                console.log(e);
                res.status(400).send(e.message);
            }
  });

module.exports = router;
