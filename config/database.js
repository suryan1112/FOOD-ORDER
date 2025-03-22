import mongoose from "mongoose"

export const Connection=()=>{
    console.log("connecting to.. "+process.env.DATABASE_URL2);
    mongoose.connect(process.env.DATABASE_URL2)
    .then(()=>console.log('connected to db'))
    .catch((error)=>console.log(error))
}

