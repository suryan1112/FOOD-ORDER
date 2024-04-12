import mongoose from "mongoose"

export const Connection=()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>console.log('connected to db'))
}

