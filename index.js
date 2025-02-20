const express = require('express');
const dotenv = require('dotenv');
const connectionDB = require('./config/db');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

dotenv.config();
connectionDB();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());

const PORT = process.env.PORT || 5000;

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});