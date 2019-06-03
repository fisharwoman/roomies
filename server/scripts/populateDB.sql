INSERT INTO Households VALUES
(1, '10 buttertubs drive'),
(2, '277 twiggly wiggly road'),
(3, '1 the tragically hip way'),
(4, '4104 road to nowhere, iqaluit'),
(5, '3330 Dingle Bingle Hill Terrace');

INSERT INTO Roommates VALUES
(1, 'Rachel Green', '604-999-9999', 'O3Kr3EaN9*','rachelgreen@gmail.com'),
(2, 'Monica Geller', '778-222-2222', '5#PoHOpwV', 'monica.geller@gmail.com'),
(3, 'Joey Tribbiani', '604-123-4567', 'k#LSV^ZJ*z', 'joey_tribbiani@hotmail.com'),
(4, 'Chandler Bing', '778-999-1010', '4%!8FZ32q8', 'chandler_bing123@yahoo.com'),
(5, 'Ross Geller', '604-987-5321', '3hDi7@Xub', 'Ross_geller@alumni.ubc.ca');

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



INSERT INTO Contacts VALUES
(1, 'Phoebe Buffay', '604-222-3333', 'Best friend',2),
(2, 'Cosmo Kramer', '778-888-4444', 'Plumber', 3),
(3, 'George Costanza', '999-555-2222', 'Father', 3),
(4, 'Jerry Seinfeld', '777-666-5555', '', 4),
(5, 'Elaine Benes', '123-456-7890', 'Landlord', 5);

INSERT INTO Reminders VALUES
(1, 'bake lasagna', '2019-06-22 19:15:00-07', 2),
(2, 'rehearse lines', '2019-06-23 16:30:00-07', 3),
(3, 'Chew Gum', '2019-06-23 16:45:00-07', 2),
(4, 'clean apartment', '2019-06-28 13:15:00-07', 2),
(5, 'straighten hair!!!', '2019-07-01 08:00:00-07', 1);

-- INSERT INTO Roommate_Reminders VALUES
