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

