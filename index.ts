import * as mongoose from 'mongoose'
import * as colors from 'colors'
const authRouter = require('./authRouter')
const express= require('express')
const PORT = process.env.PORT || 5000

const app = express()
app.use(express.json())
app.use('/auth', authRouter)
const  start = async  () =>{
    try{
        await mongoose.connect('mongodb+srv://test:test@cluster0.rpl7h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
        app.listen(PORT, () => console.log(colors.red(`Server started on port ${PORT}`)))
    }catch (e){
        console.log(e)
    }
}

start()