
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'tesla-super-secret-key';

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Mock database
const db = {
  users: [],
  referrals: [],
  sessions: {}
};

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = db.users.find(u => u.id === user.id);
    if (!req.user) return res.status(404).json({ message: 'User not found' });
    next();
  });
};

// Auth Routes
app.post('/api/register', async (req, res) => {
  const { email, password, firstName, lastName, country } = req.body;
  
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    firstName,
    lastName,
    country,
    emailVerified: false,
    kycVerified: false,
    balance: 0,
    registrationDate: new Date().toISOString(),
    profile: {
      username: '',
      gender: 'male',
      dob: '',
      phone: '',
      city: '',
      zipCode: '',
      address: '',
      avatar: null
    }
  };

  db.users.push(newUser);
  
  // Demo auto-verify link for testing purposes
  console.log(`Verification link: /api/verify-email?email=${email}`);

  res.status(201).json({ 
    message: 'User registered. Please verify your email.',
    email: email // Returning email so frontend can show/use it for the demo verify
  });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (!user.emailVerified) {
    return res.status(403).json({ message: 'Please verify your email address first.' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName } });
});

app.get('/api/me', authenticateToken, (req, res) => {
  const { password, ...userWithoutPassword } = req.user;
  res.json(userWithoutPassword);
});

app.put('/api/profile', authenticateToken, (req, res) => {
  const userIndex = db.users.findIndex(u => u.id === req.user.id);
  db.users[userIndex].profile = { ...db.users[userIndex].profile, ...req.body };
  const { password, ...updatedUser } = db.users[userIndex];
  res.json({ message: 'Profile updated', user: updatedUser });
});

app.post('/api/reset-password', (req, res) => {
  const { email } = req.body;
  const user = db.users.find(u => u.email === email);
  if (user) {
    console.log(`Password reset link sent to ${email}`);
  }
  res.json({ message: 'If an account exists, a reset link has been sent.' });
});

// Returns JSON instead of plain text to satisfy frontend JSON parsing
app.get('/api/verify-email', (req, res) => {
  const { email } = req.query;
  const user = db.users.find(u => u.email === email);
  if (user) {
    user.emailVerified = true;
    return res.json({ message: 'Email verified! You can now login.' });
  }
  res.status(404).json({ message: 'User not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Tesla Backend running on port ${PORT}`);
});
