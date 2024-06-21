const express = require('express');
const userApp = express.Router();
const bcryptjs = require('bcryptjs');
const expressAsyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
require('dotenv').config();

let usersCollection;
let appointmentsCollection;
let doctorsCollection;
let contactMessagesCollection;

userApp.use((req, res, next) => {
  usersCollection = req.app.get('userscollection');
  appointmentsCollection = req.app.get('appointmentscollection');
  doctorsCollection = req.app.get('doctorscollection');
  contactMessagesCollection = req.app.get('contactmessagescollection');
  if (!usersCollection || !appointmentsCollection || !doctorsCollection || !contactMessagesCollection) {
    return res.status(500).send({ error: 'Database connection error' });
  }
  req.usersCollection = usersCollection;
  req.appointmentsCollection = appointmentsCollection;
  req.doctorsCollection = doctorsCollection;
  req.contactMessagesCollection = contactMessagesCollection;
  next();
});

// Middleware to verify token
function verifyToken(req, res, next) {
  const bearerToken = req.headers.authorization;
  if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Authorization header missing or malformed' });
  }
  const token = bearerToken.split(' ')[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.error('Error verifying token:', err);
    return res.status(401).send({ message: 'Invalid or expired token' });
  }
}

// Middleware to extract user ID from token
function extractUserId(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    console.error('Error extracting user ID:', error);
    return res.status(401).send({ message: 'Invalid or expired token' });
  }
}

// User registration
userApp.post('/user', expressAsyncHandler(async (req, res) => {
  const newUser = req.body;
  const dbuser = await usersCollection.findOne({ email: newUser.email });
  if (dbuser != null) {
    res.send({ message: "User existed" });
  } else {
    const hashedPassword = await bcryptjs.hash(newUser.password, 6);
    newUser.password = hashedPassword;
    await usersCollection.insertOne(newUser);
    res.send({ message: "User created" });
  }
}));

// User login
userApp.post('/login', expressAsyncHandler(async (req, res) => {
  const userCred = req.body;
  const dbuser = await usersCollection.findOne({ email: userCred.email });

  if (dbuser == null) {
    res.send({ message: "Invalid email" });
  } else {
    const status = await bcryptjs.compare(userCred.password, dbuser.password);
    if (status === false) {
      res.send({ message: "Invalid Password" });
    } else {
      try {
        const signedToken = jwt.sign({ email: dbuser.email, userId: dbuser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.send({ message: "Login Success", token: signedToken, userId: dbuser._id, user: dbuser });
      } catch (error) {
        console.error('Error generating JWT token:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    }
  }
}));

// Get user data
userApp.get('/user', verifyToken, expressAsyncHandler(async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send({ message: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const dbuser = await usersCollection.findOne({ email: decoded.email }, { projection: { password: 0 } });

    if (dbuser) {
      res.send({ user: dbuser });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(401).send({ message: 'Invalid or expired token' });
  }
}));

// Get all doctors
userApp.get('/doctors', expressAsyncHandler(async (req, res) => {
  let doctorsList = await doctorsCollection.find({ status: true }).toArray();
  res.send({ message: "doctors", payload: doctorsList });
}));

// Apply verifyToken middleware to appointments route
userApp.get('/appointments', verifyToken, expressAsyncHandler(async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
    const dbuser = await usersCollection.findOne({ email: decoded.email });
    if (!dbuser) {
      return res.status(404).send({ message: 'User not found' });
    }

    const userAppointments = await appointmentsCollection.aggregate([
      { $match: { userId: new ObjectId(dbuser._id) } },
      {
        $lookup: {
          from: 'doctorscollection',
          localField: 'doctorId',
          foreignField: '_id',
          as: 'doctorDetails'
        }
      },
      {
        $unwind: '$doctorDetails'
      }
    ]).toArray();

    res.send({ message: 'Appointments fetched successfully', appointments: userAppointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
}));

// Update Profile
userApp.post('/update-profile', verifyToken, extractUserId, expressAsyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;
    const updatedDetails = req.body;

    if (updatedDetails.password) {
      updatedDetails.password = await bcryptjs.hash(updatedDetails.password, 6);
    }

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updatedDetails }
    );

    res.status(200).send({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
}));

// Store contact us form details
userApp.post('/contact', expressAsyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await contactMessagesCollection.insertOne({ name, email, message, date: new Date() });
    res.status(200).send({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error storing contact form details:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
}));

module.exports = userApp;
