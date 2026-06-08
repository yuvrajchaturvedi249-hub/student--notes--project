const Note = require('../models/Note');

// 1. NOTES UPLOAD KARNA
exports.uploadNote = async (req, res) => {
    try {
        const { title, description, fileUrl, price, uploadedBy } = req.body;

        const newNote = new Note({
            title,
            description,
            fileUrl,
            price,
            uploadedBy // Kis user ne kiya uski ID
        });

        await newNote.save();
        res.status(201).json({ message: 'Notes makhanchor upload ho gaye hain! 📚', note: newNote });
    } catch (error) {
        res.status(500).json({ message: 'Notes upload mein locha hua', error: error.message });
    }
};

// 2. SAARE NOTES DEKHNA (Site par dikhane ke liye)
exports.getAllNotes = async (req, res) => {
    try {
        // .populate('uploadedBy', 'name') se hume uploader ka naam bhi mil jayega
        const notes = await Note.find().populate('uploadedBy', 'name');
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Notes laane mein dikkat hui', error: error.message });
    }
};