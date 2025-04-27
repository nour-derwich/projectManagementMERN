const express = require('express');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const app = express();
require('dotenv').config();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json(), express.urlencoded({ extended: true }));

const db_name = 'management';
require("./config/mongoose.config")(db_name);

// Create HTTP server using Express app
const server = http.createServer(app);

// Initialize Socket.io with the server
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST"]
  }
});

// Make io accessible in routes
app.set('io', io);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Import routes after io is set
require('./routes/project.routes')(app);
require('./routes/user.routes')(app);
app.use('/api/departments', require('./routes/department.routes'));
app.use('/api/employee', require('./routes/employee.routes'));
app.use('/api/positions', require('./routes/position.routes'));
app.get('/api/test-email', async (req, res) => {
  try {
    const { sendEmail } = require('../utils/email');
    await sendEmail(
      'nourderouich159@gmail.com', // Your own email to receive the test
      'Test Email',
      'This is a test email from your project management system',
      '<h1>Test Email</h1><p>This is a test email from your project management system</p>'
    );
    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Email test failed:', error);
    res.status(500).json({ message: 'Failed to send test email', error: error.message });
  }
});
const PORT = process.env.PORT || 5000;

// Use server.listen instead of app.listen
server.listen(PORT, () => console.log(`Server running on port ${PORT}...`));