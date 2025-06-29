const mongoose = require('mongoose');

const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "test" // Explicitly set the database name
    });
    console.log(`Database connected to: ${connect.connection.host}, Database name: ${connect.connection.name}`);
  } catch (e) {
    console.error('Database connection error:', e);
    process.exit(1);
  }
};

module.exports = dbConnect;