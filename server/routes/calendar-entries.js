const express = require('express');
const router = express.Router();
const db = require('../db');

const url = "http://localhost:3000/calendar-entries/";

/* selects all reminders for specified houseID only */
router
    .get('/reminders/houses/:houseID', async (req,res) => {
        try {
            const query1 = `CREATE OR REPLACE VIEW RemindersByHouseID AS
            SELECT * FROM Reminders
            RIGHT JOIN (SELECT * FROM Household_Roommates WHERE 
              Household_Roommates.houseID = ${req.params.houseID}) AS derivedTable
            ON derivedTable.roommateID = Reminders.creator`;
  
            const query2 = `SELECT reminderID, title, reminderdate, creator FROM RemindersByHouseID
            ORDER BY reminderdate`;
            await db.any(query1);
            let result = await db.any(query2);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })

     /* GET reminders based on remindersid. */
     .get('/reminders/:reminderID', async (req,res) => {
        try {
            const query = `SELECT * FROM Reminders WHERE reminderID = ${req.params.reminderID}`;
            let result = await db.any(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })

     /* GET reminders based on creator. */
     .get('/reminders/houses/:houseID/creator/:creator', async (req,res) => {
        try {
            const query1 = `CREATE OR REPLACE VIEW RemindersByHouseID AS
            SELECT * FROM Reminders
            RIGHT JOIN (SELECT * FROM Household_Roommates WHERE 
              Household_Roommates.houseID = ${req.params.houseID}) AS derivedTable
            ON derivedTable.roommateID = Reminders.creator`;

            const query = `SELECT reminderID, title, reminderdate, creator FROM RemindersByHouseID 
            WHERE creator = ${req.params.creator} ORDER BY reminderdate`;
            await db.any(query1).then;
            let result = await db.any(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })

    .post('/reminders', async (req,res) => {
        try {
            const query = `INSERT INTO Reminders (title, reminderDate, creator)` +
                `VALUES ('${req.body.title}', '${req.body.reminderDate}', '${req.body.creator}')` +
                `RETURNING reminderID;`;
                // console.log (query);
            let result = await db.any(query);
            // console.log(result[0].reminderid);
            res.status(200).send("http://localhost:3000/reminders/" + result[0].reminderid);
        } catch (e) {
            console.log(e);
            res.status(400).send(e.message);
        }
    })

    .patch('/reminders/:reminderID', async (req,res) => {
        try {
            const query = `UPDATE Reminders SET
            title = '${req.body.title}', reminderDate = '${req.body.reminderDate}', creator = '${req.body.creator}'` +
            `WHERE reminderID = '${req.params.reminderID}' RETURNING * ;`
            let result = await db.any(query);
            res.status(200).send(result);
        } catch (e) {
            console.log(e);
            res.status(400).send(e.message);
        }
    })



    /* selects all events for specified houseID only */
    .get('/events/houses/:houseID', async (req,res) => {
        try {
            const query1 = `CREATE OR REPLACE VIEW EventsByHouseID AS
            SELECT * FROM Events
            RIGHT JOIN (SELECT * FROM Household_Roommates WHERE 
              Household_Roommates.houseID = ${req.params.houseID}) AS derivedTable
            ON derivedTable.roommateID = Events.creator`;
  
            const query2 = `SELECT eventID, title, startDate, endDate, creator FROM EventsByHouseID`;
            await db.any(query1);
            let result = await db.any(query2);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })

    /* GET events based on eventsid. */
    .get('/events/:eventID', async (req,res) => {
        try {
            const query = `SELECT * FROM Events WHERE eventID = ${req.params.eventID}`;
            let result = await db.any(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })

    /* GET reminders based on creator. */
    .get('/events/houses/:houseID/creator/:creator', async (req,res) => {
        try {
            const query1 = `CREATE OR REPLACE VIEW RemindersByHouseID AS
            SELECT * FROM Events
            RIGHT JOIN (SELECT * FROM Household_Roommates WHERE 
              Household_Roommates.houseID = ${req.params.houseID}) AS derivedTable
            ON derivedTable.roommateID = Events.creator`;

            const query = `SELECT eventID, title, startDate, endDate, creator FROM EventsByHouseID 
            WHERE creator = ${req.params.creator} ORDER BY startDate`;
            await db.any(query1).then;
            let result = await db.any(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })

    .post('/events', async (req,res) => {
        try {
            const query = `INSERT INTO Events (title, startDate, endDate, creator)` +
                `VALUES ('${req.body.title}', '${req.body.startDate}', '${req.body.endDate}', '${req.body.creator}')` +
                `RETURNING eventID;`;
            let result = await db.any(query);
            res.status(200).send("http://localhost:3000/events/" + result[0].eventid);
        } catch (e) {
            console.log(e);
            res.status(400).send(e.message);
        }
    })

    .patch('/events/:eventID', async (req,res) => {
        try {
            const query = `UPDATE Events SET
            title = '${req.body.title}', startDate = '${req.body.startDate}', endDate = '${req.body.endDate}', creator = '${req.body.creator}'` +
            `WHERE eventID = '${req.params.eventID}' RETURNING * ;`
            let result = await db.any(query);
            res.status(200).send(result);
        } catch (e) {
            console.log(e);
            res.status(400).send(e.message);
        }
    })


module.exports = router;