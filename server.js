const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ojmc4073!',
  database: 'StundenplanDB'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Middleware to check if the user is authenticated as an admin
const isAdmin = (req, res, next) => {
  if (req.session && req.session.admin === 1) {
    return next();
  } else {
    res.redirect('/');
  }
};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM Login WHERE Username = ? AND Password = ?';
  connection.query(query, [username, password], (err, results) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else if (results.length > 0) {
      const user = results[0];
      req.session.loginID = user.loginID;
      req.session.admin = user.Admin;

      const redirectURL = user.Admin === 1 ? '/admin' : '/home';

      res.json({ success: true, redirectURL: redirectURL, isAdmin: user.Admin });
    } else {
      res.json({ success: false, message: 'Invalid login credentials' });
    }
  });
});

app.get('/home', (req, res) => {
  if (req.session.loginID) {
    res.sendFile(__dirname + '/home.html');
  } else {
    res.redirect('/');
  }
});

app.get('/class-options', (req, res) => {
  const query = 'SELECT ClassID, Class FROM Class';

  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      res.json({ success: true, classes: results });
    }
  });
});

app.get('/timetable/:classID', (req, res) => {
  const classID = req.params.classID;

  const query = `
    SELECT Lesson.*, Time.Time_slots, Rooms.Room_name, Teachers.Teacher
    FROM Lesson
    JOIN Time ON Lesson.TimeID = Time.TimeID
    JOIN Rooms ON Lesson.RoomID = Rooms.RoomID
    JOIN Teachers ON Lesson.TeacherID = Teachers.TeacherID
    WHERE Lesson.ClassID = ?
  `;

  connection.query(query, [classID], (err, results) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      res.json({ success: true, timetableData: results });
    }
  });
});

// Admin page route
app.get('/admin', isAdmin, (req, res) => {
  res.sendFile(__dirname + '/admin.html');
});
// Endpoint to fetch teacher options
app.get('/teacher-options', isAdmin, (req, res) => {
    const query = 'SELECT TeacherID, Teacher FROM Teachers';
  
    connection.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      } else {
        res.json({ success: true, teachers: results });
      }
    });
  });
  
  // Endpoint to fetch room options
  app.get('/room-options', isAdmin, (req, res) => {
    const query = 'SELECT RoomID, Room_name FROM Rooms';
  
    connection.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      } else {
        res.json({ success: true, rooms: results });
      }
    });
  });
  
  // Endpoint to fetch class options
  app.get('/class-options', isAdmin, (req, res) => {
    const query = 'SELECT ClassID, Class FROM Class';
  
    connection.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      } else {
        res.json({ success: true, classes: results });
      }
    });
  });
  
  // Endpoint to fetch time options
  app.get('/time-options', isAdmin, (req, res) => {
    const query = 'SELECT TimeID, Time_slots FROM Time';
  
    connection.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      } else {
        res.json({ success: true, times: results });
      }
    });
  });

// Endpoint to fetch all lessons
app.get('/lessons', isAdmin, (req, res) => {
    const query = `
      SELECT Lesson.LessonID, Class.Class, Teachers.Teacher, Rooms.Room_name, Lesson.Day, Time.Time_slots
      FROM Lesson
      JOIN Class ON Lesson.ClassID = Class.ClassID
      JOIN Teachers ON Lesson.TeacherID = Teachers.TeacherID
      JOIN Rooms ON Lesson.RoomID = Rooms.RoomID
      JOIN Time ON Lesson.TimeID = Time.TimeID
    `;
  
    connection.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      } else {
        res.json({ success: true, lessons: results });
      }
    });
});
  // Endpoint to add a new lesson
  app.post('/add-lesson', isAdmin, (req, res) => {
    const { classID, teacherID, roomID, day, timeID } = req.body;
  
    const query = 'INSERT INTO Lesson (ClassID, TeacherID, RoomID, Day, TimeID) VALUES (?, ?, ?, ?, ?)';
    
    connection.query(query, [classID, teacherID, roomID, day, timeID], (err, results) => {
      if (err) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      } else {
        res.json({ success: true, message: 'Lesson added successfully' });
      }
    });
  });
  
  app.get('/lesson/:lessonID', isAdmin, (req, res) => {
    const lessonID = req.params.lessonID;
  
    const query = `
      SELECT Lesson.*, Class.Class, Teachers.Teacher, Rooms.Room_name, Time.Time_slots
      FROM Lesson
      JOIN Class ON Lesson.ClassID = Class.ClassID
      JOIN Teachers ON Lesson.TeacherID = Teachers.TeacherID
      JOIN Rooms ON Lesson.RoomID = Rooms.RoomID
      JOIN Time ON Lesson.TimeID = Time.TimeID
      WHERE Lesson.LessonID = ?
    `;
  
    connection.query(query, [lessonID], (err, results) => {
      if (err) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      } else if (results.length > 0) {
        const lessonData = results[0];
        res.json({ success: true, lesson: lessonData });
      } else {
        res.status(404).json({ success: false, message: 'Lesson not found' });
      }
    });
  });
  
  app.get('/admin_edit.html', isAdmin, (req, res) => {
    res.sendFile(__dirname + '/admin_edit.html');
  });

  // Endpoint to edit a lesson (update)
  app.put('/edit-lesson/:lessonID', isAdmin, (req, res) => {
    const lessonID = req.params.lessonID;
    const { classID, teacherID, roomID, day, timeID } = req.body;
  
    const query = `
      UPDATE Lesson
      SET ClassID = ?, TeacherID = ?, RoomID = ?, Day = ?, TimeID = ?
      WHERE LessonID = ?
    `;
  
    connection.query(query, [classID, teacherID, roomID, day, timeID, lessonID], (err, results) => {
      if (err) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      } else {
        res.json({ success: true, message: 'Lesson updated successfully' });
      }
    });
  });
  
  
  // Endpoint to delete a lesson
  app.delete('/delete-lesson/:lessonID', isAdmin, (req, res) => {
    const lessonID = req.params.lessonID;
  
    const query = 'DELETE FROM Lesson WHERE LessonID = ?';
  
    connection.query(query, [lessonID], (err, results) => {
      if (err) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      } else {
        res.json({ success: true, message: 'Lesson deleted successfully' });
      }
    });
  });

  // Endpoint to fetch filtered lessons
app.get('/filtered-lessons', isAdmin, (req, res) => {
    const classID = req.query.classID || '%';
    const teacherID = req.query.teacherID || '%';
    const roomID = req.query.roomID || '%';

    const query = `
        SELECT Lesson.LessonID, Class.Class, Teachers.Teacher, Rooms.Room_name, Lesson.Day, Time.Time_slots
        FROM Lesson
        JOIN Class ON Lesson.ClassID = Class.ClassID
        JOIN Teachers ON Lesson.TeacherID = Teachers.TeacherID
        JOIN Rooms ON Lesson.RoomID = Rooms.RoomID
        JOIN Time ON Lesson.TimeID = Time.TimeID
        WHERE Lesson.ClassID LIKE ? AND Lesson.TeacherID LIKE ? AND Lesson.RoomID LIKE ?
    `;

    connection.query(query, [classID, teacherID, roomID], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else {
            res.json({ success: true, lessons: results });
        }
    });
});

app.get('/user-info', (req, res) => {
    const loginID = req.session.loginID;

    const query = 'SELECT Username, ClassID FROM Login WHERE loginID = ?';
    connection.query(query, [loginID], (err, results) => {
        if (err) {
            console.error('Error fetching user info:', err); // Log the error details
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else if (results.length > 0) {
            const userInfo = results[0];
            res.json({ success: true, username: userInfo.Username, defaultClass: userInfo.ClassID });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
