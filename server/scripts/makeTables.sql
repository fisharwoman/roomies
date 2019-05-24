CREATE TABLE Households(
	houseID integer PRIMARY KEY,
	address varchar(40)
);

CREATE TABLE Roommates(
	userID varchar(50) PRIMARY KEY,
	name varchar(40),
	phoneno bigint,
	password varchar(20),
	email text
);

CREATE TABLE Household_Roommates (
	houseID integer REFERENCES Households,
	roommateID varchar(50) REFERENCES Roommates(userID),
	PRIMARY KEY(houseID,roommateID)
);

CREATE TABLE Rooms (
	houseID integer REFERENCES Households,
	roomName varchar(40),
	PRIMARY KEY (houseID, roomName)
);

CREATE TABLE EmergencyContacts (
	ecID integer PRIMARY KEY,
	name varchar(20),
	phoneNo bigint,
	relationship text,
	listedBy integer REFERENCES Roommates(userID),
);

CREATE TABLE Reminders (
	reminderID integer PRIMARY KEY,
	title varchar(40),
	reminderDate date,
	creator integer REFERNCES Roommates(userID) ON DELETE CASCADE,
);

CREATE TABLE Roommate_Reminders(
	reminderID integer REFERENCES Reminders ON DELETE CASCADE ON UPDATE CASCADE,
	userToRemind integer ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY (reminderID, userToRemind)
);

CREATE TABLE Events (
	eventID integer PRIMARY KEY,
	title varchar(40),
	eventDate date,
	creator integer REFERENCES Roommates(userID) ON DELETE CASCADE ON UPDATE CASCADE,
);

CREATE TABLE Events_Located_int (
	eventID integer REFERENCES Events ON DELETE CASCADE ON UPDATE CASCADE,
	roomName varChar(40) REFERENCES Rooms ON DELETE CASCADE ON UPDATE CASCADE,
	houseID integer REFERENCES Households ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY (eventID, houseID, roomName)
);

CREATE TABLE Expenses(
	expenseID integer PRIMARY KEY,
	expenseDate date NOT NULL,
	amount money NOT NULL CHECK (amount >= 0),
	description varchar(40),
	createdBy integer REFERENCES Roommates(userID), 
	expenseType integer REFERENCES ExpenseTypes(etID),
	houseId integer REFERENCES Households ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE PartialExpenses (
	expenseID integer REFERENCES Expenses ON DELETE CASCADE ON UPDATE CASCADE,
	lender integer REFERENCES Roommates(userID),
	borrower integer REFERENCES Roommates(userID) ON DELETE CASCADE ON UPDATE CASCADE,
	amount money NOT NULL CHECK (amount >= 0),
	dateSplit date NOT NULL,
	datePaid date,
	PRIMARY KEY (expenseID, lender, borrower),
);

CREATE TABLE ExpenseTypes (
	expenseTypeID integer PRIMARY KEY, 
	description varchar(40),
	category integer,
	FOREIGN KEY category REFERENCES ExpenseCategories(categoryID) ON DELETE SET DEFAULT
)