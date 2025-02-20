const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const connectionDB = async () => {
    try {
       const conn= await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to database: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectionDB;