const mongoose = require('mongoose');
require('dotenv/config');
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://Moetez:Moetez123456@atlascluster.csc8yg9.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};
module.exports = connectDB;