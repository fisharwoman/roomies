CREATE TABLE IF NOT EXISTS Households(
	houseID integer PRIMARY KEY,
	address text
);

CREATE TABLE IF NOT EXISTS Roommates(
	userID integer PRIMARY KEY,
	name varchar(40) NOT NULL,
	phoneNo varchar(15),
	password varchar(20) NOT NULL,
	email text UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Household_Roommates (
	houseID integer REFERENCES Households ON DELETE CASCADE ON UPDATE CASCADE,
	roommateID integer REFERENCES Roommates(userID) ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY(houseID,roommateID)
);

CREATE TABLE IF NOT EXISTS Rooms (
	houseID integer NOT NULL REFERENCES Households,
	roomName varchar(40) NOT NULL,
	PRIMARY KEY (houseID, roomName)
);

CREATE TABLE IF NOT EXISTS Contacts (
	cID integer PRIMARY KEY,
	name varchar(20) NOT NULL,
	phoneNo varchar(15) NOT NULL,
	relationship text,
	listedBy integer REFERENCES Roommates(userID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Reminders (
	reminderID integer PRIMARY KEY,
	title varchar(40),
	reminderDate timestamptz NOT NULL,
	creator integer REFERENCES Roommates(userID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Roommate_Reminders(
	reminderID integer REFERENCES Reminders ON DELETE CASCADE ON UPDATE CASCADE,
	userToRemind integer REFERENCES Roommates(userID) ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY (reminderID, userToRemind)
);

CREATE TABLE IF NOT EXISTS Events (
	eventID integer PRIMARY KEY,
	title varchar(40),
	eventDate timestamptz NOT NULL,
	creator integer REFERENCES Roommates(userID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Events_Located_In (
	eventID integer REFERENCES Events ON DELETE CASCADE ON UPDATE CASCADE,
	houseID integer,
	roomName varChar(40),
	FOREIGN KEY (roomName,houseID) REFERENCES Rooms(roomName,houseID) ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY (eventID, houseID, roomName)
);

CREATE TABLE IF NOT EXISTS ExpenseCategories (
    categoryID integer PRIMARY KEY,
    description varchar(40) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS ExpenseTypes (
	expenseTypeID integer PRIMARY KEY,
	description varchar(40) NOT NULL UNIQUE,
	category integer REFERENCES ExpenseCategories(categoryID)
);

CREATE TABLE IF NOT EXISTS Expenses(
	expenseID integer PRIMARY KEY,
	expenseDate timestamptz NOT NULL,
	amount money NOT NULL CHECK (amount >= money(0.0)),
	description varchar(40) DEFAULT 'No description',
	createdBy integer REFERENCES Roommates(userID),
	expenseType integer REFERENCES ExpenseTypes(expenseTypeID),
	houseId integer REFERENCES Households ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS PartialExpenses (
	expenseID integer REFERENCES Expenses ON DELETE CASCADE ON UPDATE CASCADE,
	lender integer REFERENCES Roommates(userID),
	borrower integer REFERENCES Roommates(userID) ON DELETE CASCADE ON UPDATE CASCADE,
	amount money NOT NULL CHECK (amount >= money(0.0)),
	dateSplit timestamptz NOT NULL,
	datePaid timestamptz,
	PRIMARY KEY (expenseID, lender, borrower)
);