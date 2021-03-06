const express = require('express');
const router = express.Router();
const db = require('../db');

const url = "http://localhost:3000/calendar-entries/";

/* selects all reminders for specified houseID only */
router
    .get('/reminders/houses/:houseID', async (req,res) => {
        try {
            const query = `select * from `+
                `(select * from roommate_reminders left join reminders using (reminderid)) as tbl where usertoremind = ${req.user} ORDER BY reminderdate`;
            let result = await db.any(query);
            // console.log(result);
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
    /* DELETE a reminder of reminderID */
    .delete('/reminders/:reminderID', async (req,res) => {
        try {
            const query = `DELETE FROM Reminders WHERE reminderID = ${req.params.reminderID} RETURNING *`;
            let result = await db.one(query);
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
            await db.any(query1);
            let result = await db.any(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })

    /* GET ALL reminders based on household, that is sent to ALL users (division). */
    .get('/reminderstoall/houses/:houseID', async (req,res) => {
        try {
            let today = new Date();
            const divisionQuery = `CREATE OR REPLACE VIEW divisionQuery AS
                            SELECT * FROM Roommate_Reminders 
                             WHERE reminderID not in ( SELECT reminderID FROM (
                                (SELECT reminderID , userToRemind FROM (select roommateID as userToRemind from Household_Roommates WHERE 
                                    Household_Roommates.houseID = ${req.params.houseID}) as p cross join 
                                (SELECT distinct reminderID from Roommate_Reminders) as sp)
                            EXCEPT
                                (SELECT reminderID , userToRemind FROM Roommate_Reminders) ) AS r )`;
            const joinReminderQuery = `SELECT * FROM reminders
                                        right join (SELECT distinct reminderID FROM divisionQuery) as r
                                        on r.reminderID = reminders.reminderID WHERE reminderdate > '${today.toISOString()}' ORDER BY reminders.reminderdate`;
            // console.log(joinReminderQuery);
            await db.none(divisionQuery);
            let result = await db.any(joinReminderQuery);
            // console.log(joinReminderQuery);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })

    /* adds a new reminder. */
    .post('/reminders', async (req,res) => {
        try {
            const query = `INSERT INTO Reminders (title, reminderDate, creator)` +
                `VALUES ('${req.body.title}', '${req.body.reminderDate}', '${req.user}')` +
                `RETURNING reminderID;`;
            let result = await db.one(query);
            for (let id of req.body.reminding) {
                const subquery = `INSERT INTO Roommate_Reminders VALUES (${result.reminderid}, ${id})`;
                await db.none(subquery);
            }
            res.status(200).send("http://localhost:3000/reminders/" + result.reminderid);
        } catch (e) {
            console.log(e);
            res.status(400).send(e.message);
        }
    })

    /* update reminder. */
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
            const query1 = `SELECT * FROM  Events
            RIGHT JOIN ( SELECT eventID, roomName  FROM Events_Located_In
                WHERE houseID = ${req.params.houseID}) AS derivedTable
            on derivedTable.eventID = Events.eventID`;
            let result = await db.any(query1);
            // console.log(result);
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
    /* DELETE an event*/
    .delete('/events/:eventID', async (req, res) => {
        try {
            const query = `DELETE FROM Events WHERE eventID = ${req.params.eventID} RETURNING *`;
            let result = await db.one(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })

    /* GET reminders based on creator AND houseID. */
    .get('/events/houses/:houseID/creator/:creator', async (req,res) => {
        try {
            const query1 = `CREATE OR REPLACE VIEW EventsByHouseID AS
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

    /* adds a new event. */
    .post('/events', async (req,res) => {
        try {
            const query = `INSERT INTO Events (title, startDate, endDate, creator)` +
                `VALUES ('${req.body.title}', '${req.body.startDate}', '${req.body.endDate}', '${req.user}')` +
                `RETURNING eventID;`;
            let result = await db.one(query);
            const query2 = `INSERT INTO Events_Located_IN VALUES(${result.eventid}, ${req.body.houseid}, '${req.body.location}')`;
            await db.none(query2);
            res.status(200).json(result);
        } catch (e) {
            console.log(e);
            res.status(400).send(e.message);
        }
    })

    /* update reminder. */
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

    /* GET ALL events_located_in based on specified houseID */
    .get('/eventslocated/house/:houseID', async (req,res) => {
        try {
            const query = `SELECT * FROM Events_Located_In WHERE houseID = ${req.params.houseID}
            ORDER BY eventID`;
            let result = await db.any(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })

    /* GET events locations located in based on eventID & houseID only*/
    .get('/eventslocated/:eventID/house/:houseID', async (req,res) => {
        try {
            const query = `SELECT * FROM Events_Located_In 
            WHERE eventID = ${req.params.eventID} AND houseID = ${req.params.houseID};`
            // console.log(query)
            let result = await db.any(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })

    /* GET joined events details AND location based on houseID */
    .get('/eventsdetails/house/:houseID', async (req,res) => {
        try {
            const query = `SELECT * FROM (
                SELECT * FROM Events_Located_In WHERE houseID = '${req.params.houseID}') eventHouse
            JOIN Events
            ON Events.eventID = eventHouse.eventID
            ORDER BY Events.eventID;`
            let result = await db.any(query);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })

     /* adds new events located information */
     .post('/eventslocated/', async (req,res) => {
        try {
            const query = `INSERT INTO Events_Located_In (eventID, houseID, roomName)
                VALUES ('${req.body.eventID}', '${req.body.houseID}', '${req.body.roomName}') 
                RETURNING *;`
                // console.log(query)
            let result = await db.any(query);
            res.status(200).send("http://localhost:3000/eventslocated/" + result[0].eventid + "/" + result[0].houseid + "/"  + result[0].roomname);
        } catch (e) {
            res.status(400).send(e.message);
        }
    })





module.exports = router;