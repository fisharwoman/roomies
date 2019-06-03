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
(2, 'living room'),
(2, 'kitchen');

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

INSERT INTO Roommate_Reminders VALUES
(1,2),
(2,3),
(2,4),
(3,4),
(3,5);

INSERT INTO Events VALUES
(1, 'Dinner Party', '2019-07-12 19:15:00-07', '2019-07-12 20:15:00-07', 2),
(2, 'Audition Prac', '2019-07-13 16:30:00-07', '2019-07-13 16:45:00-07', 3),
(3, 'Work Party', '2019-07-13 16:45:00-07', '2019-07-13 18:45:00-07', 2),
(4, 'Guitar Concert', '2019-07-28 13:15:00-07', '2019-07-28 17:45:00-07', 2),
(5, 'Dinner Date', '2019-08-02 18:00:00-07', '2019-08-02 22:00:00-07', 1);

INSERT INTO Events_Located_In VALUES
(1, 1, 'living room'),
(1, 1, 'kitchen'),
(2, 1, 'study room'),
(4, 2, 'living room'),
(5, 2, 'kitchen');

INSERT INTO ExpenseCategories VALUES
(1, 'Entertainment'),
(2, 'Food & Drinks'),
(3, 'Utilities'),
(4, 'Transportation'),
(5, 'Home & Supplies'),
(6, 'Others');

INSERT INTO ExpenseTypes VALUES
(1, 'Movies', 1),
(2, 'Sports', 1),
(3, 'Music', 1),
(4, 'Games', 1),
(5, 'Food', 2),
(6, 'Groceries', 2),
(7, 'Drinks', 2),
(8, 'Hydro/Electricity', 3),
(9, 'Heat/Gas', 3),
(10, 'TV/Phone/Internet', 3),
(11, 'Water', 3),
(12, 'Others', 3),
(13, 'Parking', 4),
(14, 'Carsharing/taxi', 4),
(15, 'Gas', 4),
(16, 'General', 6),
(17, 'Household Supplies', 5),
(18, 'Services', 5),
(19, 'Appliances and electronics', 5),
(20, 'Pets', 5),
(21, 'Others', 5);

INSERT INTO Expenses VALUES
(1, '2019-04-29 19:10:25-07', 24.00, '', 1, 5, 2),
(2, '2019-05-03 17:11:14-07', 10.00, 'Toilet paper', 3, 17, 2),
(3, '2019-05-06 16:01:19-07', 38.99, 'Groceries from SaveOn', 3, 6, 2),
(4, '2019-05-07 09:12:21-07', 5.10, 'toilet paper (discount)', 2, 17, 1),
(5, '2019-05-15 17:11:14-07', 50.00, 'Electricity in April', 2, 8, 1);

INSERT INTO PartialExpenses VALUES
(1, 4, 3, 8.00, '2019-05-17 04:12:14-07', '2019-05-18 09:15:17-07'),
(1, 4, 5, 8.00, '2019-05-17 04:12:14-07', '2019-05-19 17:11:14-07'),
(2, 3, 5, 3.30, '2019-05-19 13:10:43-07', '2019-05-21 15:16:11-07'),
(2, 3, 4, 3.30, '2019-05-20 15:16:45-07', '2019-05-21 23:55:45-07'),
(3, 4, 5, 12.99, '2019-05-20 15:16:45-07', null),
(3, 4, 3, 12.99, '2019-05-20 15:16:45-07', null),
(4, 1, 2, 2.00, '2019-06-01 21:24:04-07', '2019-06-06 04:53:13-07'),
(5, 2, 1, 25.00, '2019-05-15 17:11:14-07', null);

INSERT INTO Bulletin_isCreatedBy VALUES
(1, 'Please Clean Bathroom', 'Can we please try harder to keep the bathroom clean?', '2019-05-01 14:01:24-07', 4, 5),
(1, 'Please Clean Bathroom', 'Can we please try harder to keep the bathroom clean?', '2019-05-01 14:01:24-07', 4, 3),
(2, 'Dogs are the best!!', 'Let’s buy a dog next, pleaseeee?', '2019-05-04 16:43:34-07', 1, 2),
(3, 'Friends coming over', 'Hi! My friends are coming over tonight to watch a movie and eat some pizza. We’ll try to keep it quiet!', '2019-05-05 16:58:12-07', 2, 1),
(4, 'extra pizza in fridge', 'We have leftover pizza from last night in the fridge. Help yourself!', '2019-05-06 08:02:42-07', 3, 4);