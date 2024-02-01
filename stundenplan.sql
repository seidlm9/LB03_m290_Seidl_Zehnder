Create database StundenplanDB;
use StundenplanDB;


CREATE TABLE Class (
    ClassID INT PRIMARY KEY AUTO_INCREMENT,
    Class VARCHAR(255)
);

CREATE TABLE Login (
    loginID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(255),
    Password VARCHAR(255),
    Admin BOOLEAN,
    ClassID INT,
    FOREIGN KEY (ClassID) REFERENCES Class(ClassID)
);

CREATE TABLE Teachers (
    TeacherID INT PRIMARY KEY AUTO_INCREMENT,
    Teacher VARCHAR(255)
);

CREATE TABLE Rooms (
    RoomID INT PRIMARY KEY AUTO_INCREMENT,
    Room_name VARCHAR(255)
);

CREATE TABLE Time (
    TimeID INT PRIMARY KEY AUTO_INCREMENT,
    Time_slots VARCHAR(255)
);


CREATE TABLE Lesson (
    LessonID INT PRIMARY KEY AUTO_INCREMENT,
    ClassID INT,
    TeacherID INT,
    RoomID INT,
    TimeID INT,
    Day INT CHECK (Day BETWEEN 1 AND 5),
    FOREIGN KEY (ClassID) REFERENCES Class(ClassID),
    FOREIGN KEY (TeacherID) REFERENCES Teachers(TeacherID),
    FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID),
    FOREIGN KEY (TimeID) REFERENCES Time(TimeID)
);

-- Insert data into Class table
INSERT INTO Class (Class) VALUES
    ('Class A'),
    ('Class B'),
    ('Class C'),
    ('Class D'),
    ('Class E'),
    ('Class F'),
    ('Class G'),
    ('Class H'),
    ('Class I'),
    ('Class J');

-- Insert additional teachers
INSERT INTO Teachers (Teacher) VALUES
    ('Volkan Demir'),
    ('Anna Müller'),
    ('Sarah Zimmermann'),
    ('Thomas Richter'),
    ('Laura Becker'),
    ('Markus Wagner'),
    ('Julia Weber'),
    ('Tim Klein'),
    ('Katrin Zimmermann'),
    ('Jan Becker'),
    ('Sophie Müller'),
    ('Daniel King'),
    ('Stefanie Bauer'),
    ('David Perez'),
    ('Lisa Morris'),
    ('Christian Weber'),
    ('Caroline Reed'),
    ('Kevin Jung'),
    ('Nina Griffin'),
    ('Sabine Harris'),
    ('Alex Simmons'),
    ('Monika Foster'),
    ('Jonas Griffin'),
    ('Elena Barnes'),
    ('Matthias Ward'),
    ('Monika Foster'),
    ('Katharina Sanders'),
    ('Sebastian Tucker'),
    ('Lena Trucker'),
    ('Marc Rivera'),
    ('Julian Müller'),
    ('Nicole Weber'),
    ('Phillip Bauer'),
    ('Hannah Richter'),
    ('Erik Schmitt'),
    ('Laura Müller'),
    ('Maximilian Schmidt'),
    ('Isabel Becker'),
    ('Simon Wagner'),
    ('Sophia Fischer');


-- Insert additional rooms
INSERT INTO Rooms (Room_name) VALUES
    ('Room 111'),
    ('Room 112'),
    ('Room 113'),
    ('Room 114'),
    ('Room 115'),
    ('Room 116'),
    ('Room 117'),
    ('Room 118'),
    ('Room 119'),
    ('Room 120'),
    ('Room 121'),
    ('Room 122'),
    ('Room 123'),
    ('Room 124'),
    ('Room 125'),
    ('Room 126'),
    ('Room 127'),
    ('Room 128'),
    ('Room 129'),
    ('Room 130'),
    ('Room 131'),
    ('Room 132'),
    ('Room 133'),
    ('Room 134'),
    ('Room 135'),
    ('Room 136'),
    ('Room 137'),
    ('Room 138'),
    ('Room 139'),
    ('Room 140'),
    ('Room 141'),
    ('Room 142'),
    ('Room 143'),
    ('Room 144'),
    ('Room 145'),
    ('Room 146'),
    ('Room 147'),
    ('Room 148'),
    ('Room 149'),
    ('Room 150'),
    ('Room 151'),
    ('Room 152'),
    ('Room 153'),
    ('Room 154'),
    ('Room 155'),
    ('Room 156'),
    ('Room 157'),
    ('Room 158'),
    ('Room 159'),
    ('Room 160');


-- Insert data into Time table
INSERT INTO Time (Time_slots) VALUES
    ('7:45 - 8:35'),
    ('8:45 - 9:35'),
    ('9:45 - 10:35'),
    ('10:45 - 11:35'),
    ('11:45 - 12:35'),
    ('12:45 - 13:35'),
    ('13:45 - 14:35'),
    ('14:45 - 15:35'),
    ('15:45 - 16:35'),
    ('16:45 - 17:35');

-- Insert data into Login table
INSERT INTO Login (loginID,Username, Password, Admin, ClassID) VALUES
    (0, 'user1', 'pass1', 0, 1),
    (0, 'user2', 'pass2', 0, 2),
    (0, 'user3', 'pass3', 0, 3),
    (0, 'user4', 'pass4', 0, 4),
    (0, 'user5', 'pass5', 0, 5),
    (0, 'user6', 'pass6', 0, 6),
    (0, 'user7', 'pass7', 0, 7),
    (0, 'user8', 'pass8', 0, 8),
    (0, 'user9', 'pass9', 0, 9),
    (0, 'admin', 'admin', 1, 10);