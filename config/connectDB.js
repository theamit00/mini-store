const mongoose = require('mongoose');

const connect = async function(){

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Databse Connected');
    } catch (error) {
        console.log(error);
    }
}

mongoose.set('strictQuery', true);
connect();
