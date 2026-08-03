const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const dns = require("dns");
const app  = express();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());
app.use(cookieParser());

const authRoutes = require('./routes/auth.routes')
const songRoutes = require('./routes/song.routes')

app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
module.exports = app