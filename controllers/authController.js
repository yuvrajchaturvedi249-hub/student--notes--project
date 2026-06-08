const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 1. SIGNUP KA LOGIC (Naya Account Banana)
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check karo ki user pehle se toh nahi hai
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Yeh email pehle se registered hai bhai!' });
        }

        // Password ko encrypt (hash) karna taaki hacking na ho
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Naya User database mein save karna
        user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: 'Account ekdum jhakaas ban gaya hai! 🚀' });

    } catch (error) {
        res.status(500).json({ message: 'Server mein kuch locha ho gaya', error: error.message });
    }
};

// 2. LOGIN KA LOGIC (Account Check Karna)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check karo email database mein hai ya nahi
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Galat Email ya Password, check karo fir se!' });
        }

        // Password match karke dekho
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Galat Email ya Password, check karo fir se!' });
        }

        res.status(200).json({ 
            message: `Swagat hai ${user.name}! Login successful 🎉`,
            user: { id: user._index, name: user.name, email: user.email, isSubscribed: user.isSubscribed }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server mein kuch locha ho gaya', error: error.message });
    }
};