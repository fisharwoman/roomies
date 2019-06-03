DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

CREATE TABLE IF NOT EXISTS Households(
	houseID bigserial PRIMARY KEY,
	address text
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

-- INSERT INTO Households VALUES (1,'123 road');
-- INSERT INTO Roommates VALUES (1,'john', '1234', 'password', 'something@email.com');
-- INSERT INTO Household_Roommates VALUES (1,1);

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
    description varchar(40) NOT NULL
);

CREATE TABLE IF NOT EXISTS ExpenseTypes (
	expenseTypeID bigserial PRIMARY KEY,
	description varchar(40) NOT NULL,
	category bigserial REFERENCES ExpenseCategories(categoryID)
);

CREATE TABLE IF NOT EXISTS Expenses(
	expenseID bigserial PRIMARY KEY,
	expenseDate timestamptz NOT NULL,
	amount money NOT NULL CHECK (amount >= money(0.0)),
	description varchar(40) DEFAULT 'No description',
	createdBy integer REFERENCES Roommates(userID),
	expenseType bigserial REFERENCES ExpenseTypes(expenseTypeID),
	houseId bigserial REFERENCES Households ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS PartialExpenses (
	expenseID bigserial REFERENCES Expenses ON DELETE CASCADE ON UPDATE CASCADE,
	lender bigserial REFERENCES Roommates(userID) ON DELETE CASCADE ON UPDATE CASCADE,
	borrower bigserial REFERENCES Roommates(userID) ON DELETE CASCADE ON UPDATE CASCADE,
	amount money NOT NULL CHECK (amount >= money(0.0)),
	dateSplit timestamptz NOT NULL,
	datePaid timestamptz,
	PRIMARY KEY (expenseID, borrower)
);

CREATE TABLE IF NOT EXISTS Bulletin_isCreatedBy (
	bID bigserial,
	title varchar(20) NOT NULL,
	body text,
	dateCreated timestamptz NOT NULL,
	createdBy bigserial REFERENCES Roommates(userID) ON DELETE CASCADE ON UPDATE CASCADE,
	assignedTo bigserial REFERENCES Roommates(userID) ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY (bID, assignedTo)
); 