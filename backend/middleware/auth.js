const jwt=require('jsonwebtoken');
require('dotenv').config();
exports.auth=async(req,res,next)=>{
    try{
        const token=req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ", "");
        
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing"
            })
        }

        try{
            const decode=await jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode
        }
        catch(e){
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            })
        }
        next();
    }
    catch(e){
        return res.status(401)
        .json({
            success:false,
            message:"Something went wrong while validating the token"
        })
    }
}

exports.isStudent=async(req,res,next)=>{
    try{
        if(req.user.role!==user){
            return res.status(401)
            .json({
                success:false,
                message:"This is a protected route for Student  only"
            })
        }
        next();
    }
    catch(e){
        return res.status(500)
        .json({
            success:false,
            message:"User role cannot be verified, please try again"
        })
    }
}

exports.isAdmin=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="admin"){
            return res.status(401)
            .json({
                success:false,
                message:"This is a protected route for Admin only"
            })
        }
        next();
    }
    catch(e){
        return res.status(500)
        .json({
            success:false,
            message:"User role cannot be verified, please try again"
        })
    }
}