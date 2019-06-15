insert into Households (address, name) values
('10 buttertubs drive', 'Buttertubs'),
('277 twiggly wiggly road', 'Twiggly'),
('1 the tragically hip way', 'Hip Way'),
('4104 road to nowhere, iqaluit', 'Nowhere'),
('3330 Dingle Bingle Hill Terrace', 'Dingle Bingle');

insert into Roommates(name, phoneNo, password, email) values
('Rachel Green', '604-999-9999', 'O3Kr3EaN9*','rachelgreen@gmail.com'),
('Monica Geller', '778-222-2222', '5#PoHOpwV', 'monica.geller@gmail.com'),
('Joey Tribbiani', '604-123-4567', 'k#LSV^ZJ*z', 'joey_tribbiani@hotmail.com'),
('Chandler Bing', '778-999-1010', '4%!8FZ32q8', 'chandler_bing123@yahoo.com'),
('Ross Geller', '604-987-5321', '3hDi7@Xub', 'Ross_geller@alumni.ubc.ca');

insert into Household_Roommates values
(1,1),
(1,2),
(2,3),
(2,4),
(2,5);

insert into Rooms values
(1, 'living room'),
(1, 'kitchen'),
(1, 'study room'),
(1, 'laundry room'),
(2, 'living room'),
(2, 'kitchen');

insert into Contacts (name, phoneNo, relationship, listedBy) values
('Phoebe Buffay', '604-222-3333', 'Best friend',2),
('Cosmo Kramer', '778-888-4444', 'Plumber', 3),
('George Costanza', '999-555-2222', 'Father', 3),
('Jerry Seinfeld', '777-666-5555', '', 4),
('Elaine Benes', '123-456-7890', 'Landlord', 5),
('James Bond', '123-555-7890', 'Sister', 1);

insert into Reminders (title, reminderDate, creator) values
('bake lasagna', '2019-06-22 19:15:00-07', 2),
('rehearse lines', '2019-06-23 16:30:00-07', 3),
('Chew Gum', '2019-06-23 16:45:00-07', 2),
('clean apartment', '2019-06-28 13:15:00-07', 2),
('straighten hair!!!', '2019-07-01 08:00:00-07', 1);

INSERT INTO Roommate_Reminders VALUES
(1,2),
(2,3),
(2,4),
(3,4),
(3,5);

INSERT INTO Events (title, startDate, endDate, creator) VALUES
('Dinner Party', '2019-07-12 19:15:00-07', '2019-07-12 20:15:00-07', 2),
('Audition Prac', '2019-07-13 16:30:00-07', '2019-07-13 16:45:00-07', 3),
('Work Party', '2019-07-13 16:45:00-07', '2019-07-13 18:45:00-07', 2),
('Guitar Concert', '2019-07-28 13:15:00-07', '2019-07-28 17:45:00-07', 2),
('Dinner Date', '2019-08-02 18:00:00-07', '2019-08-02 22:00:00-07', 1);

INSERT INTO Events_Located_In VALUES
(1, 1, 'living room'),
(1, 1, 'kitchen'),
(2, 1, 'study room'),
(4, 2, 'living room'),
(5, 2, 'kitchen');

INSERT INTO ExpenseCategories (description) VALUES
('Entertainment'),
('Food & Drinks'),
('Utilities'),
('Transportation'),
('Home & Supplies'),
('Others');

INSERT INTO ExpenseTypes (description, category) VALUES
('Movies', 1),
('Sports', 1),
('Music', 1),
('Games', 1),
('Food', 2),
('Groceries', 2),
('Drinks', 2),
('Hydro/Electricity', 3),
('Heat/Gas', 3),
('TV/Phone/Internet', 3),
('Water', 3),
('Others', 3),
('Parking', 4),
('Carsharing/taxi', 4),
('Gas', 4),
('General', 6),
('Household Supplies', 5),
('Services', 5),
('Appliances and electronics', 5),
('Pets', 5),
('Others', 5);

insert into Expenses (expenseDate, amount, description, createdBy, expenseType, houseID) values
('2019-04-29 19:10:25-07','24.00','no description',1,5,1),
('2019-05-03 17:11:14-07','9.00', 'Toilet Paper',3,17,2),
('2019-05-06 16:01:19-07','38.99','Groceries from Save-On',3,6,2),
('2019-05-07 09:12:21-07','5.10','Toilet Paper (on sale)', 2,17,1),
('2019-05-15 17:11:14-07', '50.00', 'April electricity bill', 4,8,2),
('2019-05-07 09:12:21-07','10.10','Kleenex', 2,17,1);

INSERT INTO PartialExpenses (expenseID, lender, borrower, amount, dateSplit, datePaid) VALUES
(1,1,1,'12.00','2019-04-29 19:10:25-07','2019-04-29 19:10:25-07'),
(1,1,2,'12.00','2019-04-29 19:10:25-07',null),
(4,3,1,'12.00','2019-04-29 19:10:25-07','2019-04-29 19:10:25-07'),
(4,3,2,'12.00','2019-04-29 19:10:25-07',null),
(2,3,3, '3.00', '2019-05-03 17:11:14-07','2019-05-03 17:11:14-07'),
(2,3,4, '3.00', '2019-05-03 17:11:14-07',null),
(2,3,5, '3.00','2019-05-03 17:11:14-07',null);

INSERT INTO Bulletin_isCreatedBy (title, body, dateCreated, createdBy, assignedTo) VALUES
('Please Clean Bathroom', 'Can we please try harder to keep the bathroom clean?', '2019-05-01 14:01:24-07', 4, 5),
('Please Clean Bathroom', 'Can we please try harder to keep the bathroom clean?', '2019-05-01 14:01:24-07', 4, 3),
('Dogs are the best!!', 'Let’s buy a dog next, pleaseeee?', '2019-05-04 16:43:34-07', 1, 2),
('Friends coming over', 'Hi! My friends are coming over tonight to watch a movie and eat some pizza. We’ll try to keep it quiet!', '2019-05-05 16:58:12-07', 2, 1),
('extra pizza in fridge', 'We have leftover pizza from last night in the fridge. Help yourself!', '2019-05-06 08:02:42-07', 3, 4);
