// Import necessary modules
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const expressAsyncHandler = require('express-async-handler');
require('dotenv').config();

// Create an Express router
const adminApp = express.Router();

// Middleware to set up database collections
adminApp.use((req, res, next) => {
  const doctorsCollection = req.app.get('doctorscollection');
  const contactMessagesCollection = req.app.get('contactmessagescollection');
  const usersCollection = req.app.get('userscollection');
  const appointmentsCollection = req.app.get('appointmentscollection');
  req.doctorsCollection = doctorsCollection;
  req.contactMessagesCollection = contactMessagesCollection;
  req.usersCollection = usersCollection;
  req.appointmentsCollection = appointmentsCollection;
  next();
});

// Admin login endpoint
adminApp.post('/admin-login', expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if the provided email and password match the admin credentials
  if (email !== 'admin@gmail.com' || password !== 'healthbooker') {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // If the credentials are correct, generate a JWT token for the admin user
  const token = jwt.sign({ email: 'admin@gmail.com', isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1d' });

  // Send the token in the response
  res.status(200).json({ token });
}));

// Add Doctor endpoint
adminApp.post('/add-doctor', verifyAdminToken, expressAsyncHandler(async (req, res) => {
  const { doctorname, specialization, experience, fees, phone } = req.body;
  const { doctorsCollection } = req;

  // Check if the doctor already exists
  const existingDoctor = await doctorsCollection.findOne({ phone });
  if (existingDoctor) {
    return res.status(400).json({ error: 'Doctor with the same phone number already exists' });
  }

  // Create a new doctor object
  const newDoctor = { doctorname, specialization, experience, fees, phone };

  // Insert the new doctor into the database
  await doctorsCollection.insertOne(newDoctor);

  // Send success response
  res.status(201).json({ message: 'Doctor added successfully', doctor: newDoctor });
}));

// View User Queries endpoint
adminApp.get('/view-queries', verifyAdminToken, expressAsyncHandler(async (req, res) => {
  const { contactMessagesCollection } = req;

  // Fetch all contact messages
  const queries = await contactMessagesCollection.find({}).toArray();

  // Send the queries in the response
  res.status(200).json({ queries });
}));

// View All Users endpoint
adminApp.get('/view-users', verifyAdminToken, expressAsyncHandler(async (req, res) => {
  const { usersCollection } = req;

  // Fetch all users
  const users = await usersCollection.find({}).toArray();

  // Send the users in the response
  res.status(200).json({ users });
}));

// Delete Doctor endpoint
adminApp.delete('/delete-doctor/:id', verifyAdminToken, expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { doctorsCollection } = req;

  // Check if the provided ID is valid
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid doctor ID' });
  }

  // Delete the doctor with the provided ID
  const result = await doctorsCollection.deleteOne({ _id: new ObjectId(id) });

  // Check if the doctor was found and deleted
  if (result.deletedCount === 0) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  // Send success response
  res.status(200).json({ message: 'Doctor deleted successfully' });
}));

// Delete User endpoint
adminApp.delete('/delete-user/:id', verifyAdminToken, expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { usersCollection } = req;

  // Check if the provided ID is valid
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  // Delete the user with the provided ID
  const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

  // Check if the user was found and deleted
  if (result.deletedCount === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Send success response
  res.status(200).json({ message: 'User deleted successfully' });
}));

// Add this to the existing admin routes in your backend
adminApp.post('/respond-query/:id', verifyAdminToken, expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { response } = req.body;
  const { contactMessagesCollection } = req;

  // Check if the provided ID is valid
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid query ID' });
  }

  // Update the query with the admin's response
  const result = await contactMessagesCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { response } }
  );

  // Check if the query was found and updated
  if (result.matchedCount === 0) {
    return res.status(404).json({ message: 'Query not found' });
  }

  // Send success response
  res.status(200).json({ message: 'Response sent successfully' });
}));

// New endpoint to request an appointment
adminApp.post('/requestAppointment', expressAsyncHandler(async (req, res) => {
  const { doctorId, date, time, userId } = req.body;
  const { appointmentsCollection } = req;

  // Create a new appointment request
  const newAppointmentRequest = {
    doctorId: new ObjectId(doctorId),
    date,
    time,
    userId: new ObjectId(userId),
    status: 'Pending', // Mark the appointment request as pending
  };

  // Insert the new appointment request into the database
  await appointmentsCollection.insertOne(newAppointmentRequest);

  // Send success response
  res.status(201).json({ message: 'Appointment request created successfully', appointment: newAppointmentRequest });
}));


// adminApp.get('/all-appointments', expressAsyncHandler(async (req, res) => {
//   const { appointmentsCollection } = req;
//   try {
//     const appointments = await appointmentsCollection.aggregate([
//       {
//         $addFields: {
//           doctorId: { $toObjectId: "$doctorId" },
//           userId: { $toObjectId: "$userId" }
//         }
//       },
//       {
//         $lookup: {
//           from: 'doctorsCollection',
//           localField: 'doctorId',
//           foreignField: '_id',
//           as: 'doctorDetails'
//         }
//       },
//       {
//         $lookup: {
//           from: 'usersCollection',
//           localField: 'userId',
//           foreignField: '_id',
//           as: 'userDetails'
//         }
//       },
//       {
//         $project: {
//           "doctorDetails.password": 0, // Exclude sensitive fields
//           "userDetails.password": 0    // Exclude sensitive fields
//         }
//       }
//     ]).toArray();
//     res.status(200).json({ appointments });
//   } catch (error) {
//     console.error('Error fetching appointments:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }));






// Endpoint for admin to approve an appointment


// adminApp.post('/approve-appointment/:id', verifyAdminToken, expressAsyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { appointmentsCollection } = req;

//   // Check if the provided ID is valid
//   if (!ObjectId.isValid(id)) {
//     return res.status(400).json({ error: 'Invalid appointment ID' });
//   }

//   // Update the appointment status to 'Approved'
//   const result = await appointmentsCollection.updateOne(
//     { _id: new ObjectId(id) },
//     { $set: { status: 'Approved' } }
//   );

//   // Check if the appointment was found and updated
//   if (result.matchedCount === 0) {
//     return res.status(404).json({ message: 'Appointment not found' });
//   }

//   // Send success response
//   res.status(200).json({ message: 'Appointment approved successfully' });
// }));

// // Endpoint for admin to reject an appointment
// adminApp.post('/reject-appointment/:id', verifyAdminToken, expressAsyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { appointmentsCollection } = req;

//   // Check if the provided ID is valid
//   if (!ObjectId.isValid(id)) {
//     return res.status(400).json({ error: 'Invalid appointment ID' });
//   }

//   // Update the appointment status to 'Rejected'
//   const result = await appointmentsCollection.updateOne(
//     { _id: new ObjectId(id) },
//     { $set: { status: 'Rejected' } }
//   );

//   // Check if the appointment was found and updated
//   if (result.matchedCount === 0) {
//     return res.status(404).json({ message: 'Appointment not found' });
//   }

//   // Send success response
//   res.status(200).json({ message: 'Appointment rejected successfully' });
// }));

// Endpoint for admin to mark attendance

adminApp.get('/pending-appointments', verifyAdminToken, expressAsyncHandler(async (req, res) => {
  const { appointmentsCollection, doctorsCollection, usersCollection } = req;
  const pendingAppointments = await appointmentsCollection.aggregate([
    { $match: { status: 'Pending' } },
    {
      $lookup: {
        from: 'doctorscollection',
        localField: 'doctorId',
        foreignField: '_id',
        as: 'doctorDetails'
      }
    },
    {
      $lookup: {
        from: 'userscollection',
        localField: 'userId',
        foreignField: '_id',
        as: 'userDetails'
      }
    },
    {
      $project: {
        _id: 1,
        date: 1,
        time: 1,
        status: 1,
        'doctorDetails.doctorname': 1,
        'doctorDetails.specialization': 1,
        'userDetails.username': 1,
        'userDetails.email': 1
      }
    }
  ]).toArray();

  res.status(200).json({ appointments: pendingAppointments });
}));


// Endpoint for admin to approve an appointment
adminApp.post('/approve-appointment/:id', verifyAdminToken, expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { appointmentsCollection } = req;

  // Check if the provided ID is valid
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid appointment ID' });
  }

  // Update the appointment status to 'Approved'
  const result = await appointmentsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: 'Approved' } }
  );

  // Check if the appointment was found and updated
  if (result.matchedCount === 0) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  // Send success response
  res.status(200).json({ message: 'Appointment approved successfully' });
}));

// Endpoint for admin to reject an appointment
adminApp.post('/reject-appointment/:id', verifyAdminToken, expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { appointmentsCollection } = req;

  // Check if the provided ID is valid
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid appointment ID' });
  }

  // Update the appointment status to 'Rejected'
  const result = await appointmentsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: 'Rejected' } }
  );

  // Check if the appointment was found and updated
  if (result.matchedCount === 0) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  // Send success response
  res.status(200).json({ message: 'Appointment rejected successfully' });
}));

// Export the admin router
module.exports = adminApp;



// Endpoint for admin to mark attendance
adminApp.patch('/mark-attendance/:id', verifyAdminToken, expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { attended } = req.body; // { attended: true/false }
  const { appointmentsCollection } = req;

  // Check if the provided ID is valid
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid appointment ID' });
  }

  // Update the appointment attendance status
  const result = await appointmentsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { attended: attended ? 'Attended' : 'Not Attended' } }
  );

  // Check if the appointment was found and updated
  if (result.matchedCount === 0) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  // Send success response
  res.status(200).json({ message: 'Attendance status updated successfully' });
}));



adminApp.get('/pending-appointments',verifyAdminToken, async (req, res) => {
  try {
    const appointmentsCollection = req.app.get('appointmentscollection');
    const pendingAppointments = await appointmentsCollection.find({ status: 'Pending' }).toArray();

    res.json({ appointments: pendingAppointments });
  } catch (error) {
    console.error('Error fetching pending appointments:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// Endpoint for fetching accepted appointments
adminApp.get('/accepted-appointments', verifyAdminToken, expressAsyncHandler(async (req, res) => {
  try {
    const { appointmentsCollection } = req;
    const acceptedAppointments = await appointmentsCollection.aggregate([
      { $match: { status: 'Approved' } },
      {
        $lookup: {
          from: 'doctorscollection',
          localField: 'doctorId',
          foreignField: '_id',
          as: 'doctorDetails'
        }
      },
      {
        $lookup: {
          from: 'userscollection',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $project: {
          _id: 1,
          date: 1,
          time: 1,
          status: 1,
          'doctorDetails.doctorname': 1,
          'doctorDetails.specialization': 1,
          'userDetails.firstname': 1,
          'userDetails.lastname': 1,
          'userDetails.email': 1
        }
      }
    ]).toArray();

    res.status(200).json({ appointments: acceptedAppointments });
  } catch (error) {
    console.error('Error fetching accepted appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}));


// Endpoint for fetching rejected appointments
adminApp.get('/rejected-appointments', verifyAdminToken, expressAsyncHandler(async (req, res) => {
  try {
    const { appointmentsCollection } = req;
    const acceptedAppointments = await appointmentsCollection.aggregate([
      { $match: { status: 'Rejected' } },
      {
        $lookup: {
          from: 'doctorscollection',
          localField: 'doctorId',
          foreignField: '_id',
          as: 'doctorDetails'
        }
      },
      {
        $lookup: {
          from: 'userscollection',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $project: {
          _id: 1,
          date: 1,
          time: 1,
          status: 1,
          'doctorDetails.doctorname': 1,
          'doctorDetails.specialization': 1,
          'userDetails.firstname': 1,
          'userDetails.lastname': 1,
          'userDetails.email': 1
        }
      }
    ]).toArray();

    res.status(200).json({ appointments: acceptedAppointments });
  } catch (error) {
    console.error('Error fetching rejected appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}));


// Middleware to verify admin token
function verifyAdminToken(req, res, next) {
  const bearerToken = req.headers.authorization;
  if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }
  const token = bearerToken.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    next();
  } catch (err) {
    console.error('Error verifying admin token:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Export the admin router
module.exports = adminApp;
