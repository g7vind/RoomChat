const express = require('express');
const connectDB = require('./db/connectDB');
const authRouters = require('./routes/auth.route');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const {app,server} = require('./socket/socket');

const ___dirname = path.resolve();

app.use(express.json());
app.use(morgan('dev'));

app.use(cors({
    origin: process.env.CLIENT_URL
}));

app.use('/api/auth', authRouters);


app.use(express.static(path.join(___dirname, '/frontend/dist')));
app.get('*', (req,res) => {
        res.sendFile(path.resolve(___dirname, "frontend", "dist", "index.html"));
});
server.listen(process.env.PORT, () => {
    connectDB()
    console.log(`Server is listening on port ${process.env.PORT}`);
});
