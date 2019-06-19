DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

CREATE TABLE IF NOT EXISTS Households(
	houseID bigserial PRIMARY KEY,
	address text,
	name text
);

CREATE TABLE IF NOT EXISTS Roommates(
	userID bigserial PRIMARY KEY,
	name varchar(40) NOT NULL,
	phoneNo varchar(15),
	password varchar(20) NOT NULL,
	email text UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Household_Roommates (
	houseID bigserial REFERENCES Households ON DELETE CASCADE ON UPDATE CASCADE,
    roommateID bigserial REFERENCES Roommates(userID) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(houseID,roommateID)
);

CREATE TABLE IF NOT EXISTS Rooms (
	houseID bigserial NOT NULL REFERENCES Households ON DELETE CASCADE ON UPDATE CASCADE,
	roomName varchar(40) NOT NULL,
	PRIMARY KEY (houseID, roomName)
);

CREATE TABLE IF NOT EXISTS Contacts (
	contactsID bigserial PRIMARY KEY,
	name varchar(20) NOT NULL,
	phoneNo varchar(15) NOT NULL,
	relationship text,
	listedBy bigserial REFERENCES Roommates(userID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Reminders (
	reminderID bigserial PRIMARY KEY,
	title varchar(40),
	reminderDate timestamptz NOT NULL,
	creator bigserial REFERENCES Roommates(userID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Roommate_Reminders(
	reminderID bigserial REFERENCES Reminders ON DELETE CASCADE ON UPDATE CASCADE,
	userToRemind bigserial REFERENCES Roommates(userID) ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY (reminderID, userToRemind)
);

CREATE TABLE IF NOT EXISTS Events (
	eventID bigserial PRIMARY KEY,
	title varchar(40),
	startDate timestamptz NOT NULL,
  endDate timestamptz NOT NULL,
	creator bigserial REFERENCES Roommates(userID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Events_Located_In (
	eventID bigserial REFERENCES Events ON DELETE CASCADE ON UPDATE CASCADE,
	houseID bigserial,
	roomName varChar(40),
	FOREIGN KEY (roomName,houseID) REFERENCES Rooms(roomName,houseID) ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY (eventID, houseID, roomName)
);

CREATE TABLE IF NOT EXISTS ExpenseCategories (
    categoryID bigserial PRIMARY KEY,
    description varchar(40) NOT NULL,
    CHECK (LENGTH(description) > 0)
);

CREATE TABLE IF NOT EXISTS ExpenseTypes (
	expenseTypeID bigserial PRIMARY KEY,
	description varchar(40) NOT NULL,
	category bigserial REFERENCES ExpenseCategories(categoryID),
	UNIQUE (description, category),
	CHECK (LENGTH(description) > 0)
);

CREATE OR REPLACE FUNCTION validate_expense(houseID bigint, roommateID integer)
RETURNS bool AS
$func$
SELECT EXISTS (SELECT * FROM Household_Roommates WHERE houseID = $1 AND roommateID = $2);
$func$ LANGUAGE sql STABLE;

CREATE TABLE IF NOT EXISTS Expenses(
	expenseID bigserial PRIMARY KEY,
	expenseDate timestamptz NOT NULL,
	amount money NOT NULL CHECK (amount >= money(0.0)),
	description varchar(40) DEFAULT 'No description',
	createdBy integer REFERENCES Roommates(userID),
	expenseType bigserial REFERENCES ExpenseTypes(expenseTypeID),
	houseId bigserial REFERENCES Households ON DELETE CASCADE ON UPDATE CASCADE,
	CHECK (validate_expense(houseId, createdBy)) NOT valid
);

CREATE OR REPLACE FUNCTION validate_partial_expense(expenseID bigint, borrowerID bigint)
RETURNS bool AS
$func$
SELECT EXISTS
(SELECT * FROM Household_Roommates WHERE houseID = (SELECT houseID FROM Expenses WHERE expenseID = $1) AND roommateID = $2);
$func$ LANGUAGE sql STABLE;

CREATE TABLE IF NOT EXISTS PartialExpenses (
	expenseID integer REFERENCES Expenses ON DELETE CASCADE ON UPDATE CASCADE,
	lender integer REFERENCES Roommates(userID) ON DELETE CASCADE ON UPDATE CASCADE,
	borrower integer REFERENCES Roommates(userID) ON DELETE CASCADE ON UPDATE CASCADE,
	amount money NOT NULL CHECK (amount >= money(0.0)),
	dateSplit timestamptz NOT NULL,
	datePaid timestamptz,
	PRIMARY KEY (expenseID, borrower),
	CHECK (validate_partial_expense(expenseID, borrower)) NOT valid
);

CREATE TABLE IF NOT EXISTS Bulletin_isCreatedBy (
	bID bigserial PRIMARY KEY,
	title varchar(30) NOT NULL,
	body text,
	dateCreated timestamptz NOT NULL,
	createdBy bigserial REFERENCES Roommates(userID) ON DELETE CASCADE ON UPDATE CASCADE,
	assignedTo bigserial REFERENCES Households(houseID) ON DELETE CASCADE ON UPDATE CASCADE
);
