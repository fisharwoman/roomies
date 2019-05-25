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





