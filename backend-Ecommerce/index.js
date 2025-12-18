// packages
import { app } from './app.js'
import dotenv from 'dotenv'


// utils
import connectDB from './config/db.js'
dotenv.config()

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`server is running at port ${process.env.PORT}`);
        
    })
    app.on('error', (err)=>{
        console.log('error',err);
        throw err;
        
    })
})
.catch((error) =>{
    console.log("Mongo db connection failed !!!",error);
    
})
