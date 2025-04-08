const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    })
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Listening on port ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log(err);
    })
