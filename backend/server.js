const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
const mongoClient = require('mongodb').MongoClient;

app.use(cors());

// Middleware
app.use(express.json());
//app.use(cors({ origin: 'http://localhost:3001' }));

// Connect DB
mongoClient.connect(process.env.MONGO_URI)
.then(client => {
    const healthbooker = client.db('healthbooker');
    const userscollection = healthbooker.collection('userscollection');
    const doctorscollection=healthbooker.collection('doctorscollection')
    const appointmentscollection=healthbooker.collection('appointmentscollection')
    const contactmessagescollection=healthbooker.collection('contactmessagescollection')
    app.set('userscollection', userscollection);
    app.set('doctorscollection',doctorscollection)
    app.set('appointmentscollection',appointmentscollection)
    app.set('contactmessagescollection',contactmessagescollection)
    console.log("DB connection success");
})
.catch(err => console.log("Err in DB connection", err));



const userApp = require('./api/user-api');
const doctorApp=require('./api/doctor-api');
const adminApp=require('./api/admin-api')

// Import and mount API routes
app.use('/user-api',userApp);
app.use('/doctor-api',doctorApp)
app.use('/admin-api',adminApp)

// Start server
const port = process.env.PORT || 3000; // Use port 3000 by default if PORT environment variable is not set
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

