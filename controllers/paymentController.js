const User = require('../models/User');

// 1. PREMIUM SUBSCRIPTION BUY KARNA
exports.buySubscription = async (req, res) => {
    try {
        const { userId } = req.body;

        // User ko database mein dhoondo aur uska status true kar do
        const user = await User.findByIdAndUpdate(
            userId, 
            { isSubscribed: true }, 
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User nahi mila!' });
        }

        res.status(200).json({ message: 'Mubarak ho! Ab aap Premium Member hain 👑', user });
    } catch (error) {
        res.status(500).json({ message: 'Subscription failed', error: error.message });
    }
};

// 2. WALLET BALANCE CHECK KARNA YA ADD KARNA (Notes ki kamai ke liye)
exports.addMoneyToWallet = async (req, res) => {
    try {
        const { userId, amount } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User nahi mila' });

        // Purane balance mein naya amount jodh do
        user.balance += Number(amount);
        await user.save();

        res.status(200).json({ message: 'Wallet mein paise jud gaye! 💰', currentBalance: user.balance });
    } catch (error) {
        res.status(500).json({ message: 'Wallet update failed', error: error.message });
    }
};