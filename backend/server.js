const express=require('express')
const mongoose=require('mongoose')
const cookie_parser=require('cookie-parser')
const fileuploader=require('express-fileupload');
const router = require('./routes/rout');
// ********
require('dotenv').config();
// const multer = require('multer');
// const bodyParser = require('body-parser');
const fs = require('fs')
const path = require('path');
const cors = require('cors'); 

// ********

require('dotenv').config();

const app=express();

app.use(express.json());
app.use(cors());
app.use(cookie_parser());
app.use(fileuploader({
    useTempFiles :true,
    tempFileDir:'/tmp'
}));

app.use('/h2c',router);

const PORT=process.env.PORT || 8000;

require('./config/database').dbConnect();
const { connectCloudinary } = require('./config/cloudinary')
connectCloudinary(); // ✅ Ensure Cloudinary is configured at startup

app.listen(PORT,()=>{
    console.log(`server is started at ${PORT}`)
})

app.get('/',(req,res)=>{
    res.send("hello everyone")
})