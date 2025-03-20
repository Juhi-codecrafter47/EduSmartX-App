const Battle = require('../models/Battle');
const User = require('../models/User');

// Send a battle request
exports.sendBattleRequest = async (req, res) => {
    const { senderId, receiverId, topic } = req.body;

    try {
        // Check if both users exist
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        if (!sender || !receiver) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Create a new battle request
        const battle = new Battle({
            senderId,
            receiverId,
            topic,
            status: "pending" // Waiting for friend to accept
        });

        await battle.save();

        res.status(200).json({ success: true, message: "Battle request sent!" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error sending battle request" });
    }
};
