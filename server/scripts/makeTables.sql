CREATE TABLE IF NOT EXISTS Households(
	houseID integer PRIMARY KEY,
	address varchar(40)
);

CREATE TABLE IF NOT EXISTS Roommates(
	userID varchar(50) PRIMARY KEY,
	name varchar(40),
	phoneno bigint,
	password varchar(20),
	email text
);

CREATE TABLE IF NOT EXISTS Household_Roommates (
	houseID integer REFERENCES Households,
	roommateID varchar(50) REFERENCES Roommates(userID),
	PRIMARY KEY(houseID,roommateID)
);

