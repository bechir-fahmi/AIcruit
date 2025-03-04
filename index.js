const express = require('express');
const dotenv = require('dotenv');
const connectionDB = require('./config/db');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const winston = require('winston');
const expressWinston = require('express-winston');

// Import des routes
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const aiRoutes = require('./routes/aiRoutes');
const testSessionRoutes = require('./routes/testSessionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const integrationRoutes = require('./routes/integrationRoutes');

const app = express();

dotenv.config();
connectionDB();

// Configuration CORS
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors(corsOptions));

// Logger de sécurité
app.use(expressWinston.logger({
    transports: [
        new winston.transports.File({ filename: 'logs/security.log' })
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/sessions', testSessionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/integrations', integrationRoutes);

// Route de base
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});