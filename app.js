const express = require('express')
const app = express()
const PORT =5000 
const mongoose=require('mongoose')
const { MONGOURI } = require('./keys')



require('./models/user')
app.use(express.json())

app.use(require('./routes/auth'))


mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on('connected',()=>{
    console.log('connected to mongo atlas')
})

mongoose.connection.on('error',(err)=>{
    console.log('error in connecting to mongo atlas',err)
})



app.listen(PORT,()=>{
    console.log('server connected at port',PORT)
})