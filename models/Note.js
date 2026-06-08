const mongoose = require('mongoose');

// Notes ka Data Structure (Schema)
const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true // Title likhna zaroori hai
    },
    description: {
        type: String
    },
    fileUrl: {
        type: String,
        required: true // PDF ya Image ka link jahan notes save hain
    },
    price: {
        type: Number,
        default: 0 // Agar 0 hai toh free note hai, varna paid
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Yeh bata raha hai ki kis User ne ye note upload kiya hai
        required: true
    }
}, {
    timestamps: true // Kab upload hua, automatic track karega
});

module.exports = mongoose.model('Note', noteSchema);