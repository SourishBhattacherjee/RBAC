const mongoose = require('mongoose');

const dbConnect = async() => {
  try{
    const connect = await mongoose.connect(process.env.MONGO_URI)
    console.log(`database connected : ${connect.connection.host}, ${connect.connection.name}`);
  }
  catch(e){
    console.log(e);
    process.exit(1);
  }

}

module.exports = dbConnect;