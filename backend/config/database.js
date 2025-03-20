const mongoose =require('mongoose');
require('dotenv').config();

exports.dbConnect=()=>{
    mongoose.connect(process.env.MONGODB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(()=>{console.log("database connected successfully")})
    .catch(()=>{console.log("issue while connecting db")})
}