require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const hotelsRouter = require('./routes/hotels');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/hotels', hotelsRouter);

app.get('/', (req, res) => res.send('Hotel API is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
