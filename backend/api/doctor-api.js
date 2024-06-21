const express = require('express');
const doctorApp = express.Router();
const { ObjectId } = require('mongodb');

doctorApp.use(express.json());

const availableTimes = [
  '09:00', '09:30', '10:00', '10:30', '11:00',
  '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00',
  '16:30', '17:00','17:30','18:00','18:30','19:00'
];

const isValidObjectId = (id) => {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
};

doctorApp.post('/doctor', async (req, res) => {
  try {
    const { doctorname, specialization, experience, fees, phone } = req.body;
    const doctorsCollection = req.app.get('doctorscollection');

    const existingDoctor = await doctorsCollection.findOne({ phone });
    if (existingDoctor) {
      return res.status(400).send({ error: 'Doctor with the same phone number already exists' });
    }

    const newDoctor = { doctorname, specialization, experience, fees, phone };
    await doctorsCollection.insertOne(newDoctor);

    res.status(201).send({ message: 'Doctor added successfully', doctor: newDoctor });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

doctorApp.get('/doctors', async (req, res) => {
  try {
    const doctorsCollection = req.app.get('doctorscollection');
    const doctors = await doctorsCollection.find().toArray();
    res.json({ doctors });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

doctorApp.get('/available-times/:doctorId/:date', async (req, res) => {
  try {
    const { doctorId, date } = req.params;

    if (!isValidObjectId(doctorId)) {
      return res.status(400).send({ error: 'Invalid doctorId' });
    }

    // Assuming you have a MongoDB collection named "appointments"
    const appointmentsCollection = req.app.get('appointmentscollection');
    const doctorIdObject = new ObjectId(doctorId);

    // Find appointments for the given doctorId and date
    const bookedTimes = await appointmentsCollection.find({ doctorId: doctorIdObject, date }).toArray();
    
    // Extract booked time slots
    const bookedTimeSlots = bookedTimes.map(appointment => appointment.time);

    // Filter available times
    const currentTime = new Date();
    const currentDate = new Date().toISOString().split('T')[0];
    let availableTimeSlots = [];

    if (date === currentDate) {
      // Filter out past time slots for today's date
      availableTimeSlots = availableTimes.filter(time => {
        const [hours, minutes] = time.split(':').map(Number);
        const timeDate = new Date(currentDate);
        timeDate.setHours(hours);
        timeDate.setMinutes(minutes);
        return timeDate > currentTime;
      });
    } else if (date > currentDate) {
      // All time slots are available for future dates
      availableTimeSlots = availableTimes;
    }

    res.json({ availableTimes: availableTimeSlots });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
});




doctorApp.post('/bookAppointment', async (req, res) => {
  try {
    const { doctorId, date, time, userId } = req.body;
    console.log('Request Body:', req.body); // Check the request body

    if (!isValidObjectId(doctorId) || !isValidObjectId(userId)) {
      return res.status(400).send({ error: 'Invalid doctorId or userId' });
    }

    const appointmentsCollection = req.app.get('appointmentscollection');
    const doctorIdObject = new ObjectId(doctorId);
    const userIdObject = new ObjectId(userId);

    const existingAppointment = await appointmentsCollection.findOne({ doctorId: doctorIdObject, date, time });
    if (existingAppointment) {
      return res.status(400).send({ error: 'This slot is already booked' });
    }

    const newAppointment = { doctorId: doctorIdObject, date, time, userId: userIdObject };
    await appointmentsCollection.insertOne(newAppointment);

    res.status(201).send({ message: 'Appointment booked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

module.exports = doctorApp;

