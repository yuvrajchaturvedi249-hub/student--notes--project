const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // .env file se MONGO_URI utha raha hai
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(` MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(` Database connection failed: ${error.message}`);
        process.exit(1); // Agar connect nahi hua toh server rok do
    }
};

module.exports = connectDB;
