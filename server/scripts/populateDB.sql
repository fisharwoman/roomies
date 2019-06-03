INSERT INTO Households (address) VALUES
('10 buttertubs drive'),
('277 twiggly wiggly road'),
('1 the tragically hip way'),
('4104 road to nowhere, iqaluit'),
('3330 Dingle Bingle Hill Terrace');

INSERT INTO Roommates(name, phoneNo, password, email) VALUES
('Rachel Green', '604-999-9999', 'O3Kr3EaN9*','rachelgreen@gmail.com'),
('Monica Geller', '778-222-2222', '5#PoHOpwV', 'monica.geller@gmail.com'),
('Joey Tribbiani', '604-123-4567', 'k#LSV^ZJ*z', 'joey_tribbiani@hotmail.com'),
('Chandler Bing', '778-999-1010', '4%!8FZ32q8', 'chandler_bing123@yahoo.com'),
('Ross Geller', '604-987-5321', '3hDi7@Xub', 'Ross_geller@alumni.ubc.ca');

INSERT INTO Household_Roommates VALUES 
(1,1),
(1,2),
(2,3),
(2,4),
(2,5);

INSERT INTO Rooms VALUES
(1, 'living room'),
(1, 'kitchen'),
(1, 'study room'),
(1, 'laundry room'),
(2, 'living room');



INSERT INTO Contacts (name, phoneNo, relationship, listedBy) VALUES
('Phoebe Buffay', '604-222-3333', 'Best friend',2),
('Cosmo Kramer', '778-888-4444', 'Plumber', 3),
('George Costanza', '999-555-2222', 'Father', 3),
('Jerry Seinfeld', '777-666-5555', '', 4),
('Elaine Benes', '123-456-7890', 'Landlord', 5);

INSERT INTO Reminders (title, reminderDate, creator) VALUES
('bake lasagna', '2019-06-22 19:15:00-07', 2),
('rehearse lines', '2019-06-23 16:30:00-07', 3),
('Chew Gum', '2019-06-23 16:45:00-07', 2),
('clean apartment', '2019-06-28 13:15:00-07', 2),
('straighten hair!!!', '2019-07-01 08:00:00-07', 1);

-- INSERT INTO Roommate_Reminders VALUES

INSERT INTO ExpenseCategories (description) VALUES
('entertainment'),
('food/drink'),
('utilities'),
('other'),
('supplies');

INSERT INTO ExpenseTypes (description, category) VALUES
('movies',1),
('grocery',2),
('water',3),
('hydro',3),
('bathroom supplies',5);

INSERT INTO Expenses(expenseDate, amount, description, createdBy, expenseType, houseID) VALUES
('2019-04-29 19:10:25-07','24.00','no description',1,2,2),
('2019-05-03 17:11:14-07','10.00', 'Toilet Paper',3,5,2),
('2019-05-06 16:01:19-07','38.99','Groceries from Save-On',3,2,2),
('2019-05-07 09:12:21-07','5.10','Toilet Paper (on sale)', 2,5,1),
('2019-05-15 17:11:14-07', '50.00', 'April electricity bill', 4,3,2);