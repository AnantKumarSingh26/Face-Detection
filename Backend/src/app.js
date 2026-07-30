const express = require('express')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.routes')

const dns = require("dns");
const app  = express();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
module.exports = app