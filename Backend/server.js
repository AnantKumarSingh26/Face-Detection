require('dotenv').config(); // Load environment variables from .env file
const app = require('../Backend/src/app')
const connectDB = require('../Backend/src/config/database')





connectDB(); // Connect to the database

app.listen(3000, () => {
    console.log('SERVER IS RUNNING ON PORT-3000');
})