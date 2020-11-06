const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const{JWT_SECRET_KEY}= require('../keys')
const requireLogin = require('../middleware/requireLogin')



router.post('/signup',(req,res)=>{

const{name,email,phoneNumber,password,repassword}=req.body

if(!name || !email || !phoneNumber || !password  ||!repassword){

    res.status(422).json({error:'please fill all the fields'})
}

User.findOne({email:email})
.then((savedUser)=>{
    if(savedUser){
        res.status(422).json({error:'user already exists with emailID'})

    }

    bcrypt.hash(password,12,)
    .then(hashedpassword=>{
        const user = new User({
            name,
            email,
            phoneNumber,
            password:hashedpassword,
            repassword
    
        })
    
        user.save()
        .then(user=>{
            res.json({message:'user saved successfully...'})
        })
    })
    .catch(err=>{
       console.log(err)
    })
    })
   
.catch(err=>{
    console.log(err)
 })
})



router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
       return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"Invalid Email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"successfully signed in"})
             const token = jwt.sign({_id:savedUser._id},JWT_SECRET_KEY)
             res.json({token})
            //    const {_id,name,email,followers,following,pic} = savedUser
            //    res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                return res.status(422).json({error:"Invalid Email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})


module.exports=router