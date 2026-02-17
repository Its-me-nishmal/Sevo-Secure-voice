const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const Message = require('../models/Message');

/**
 * Deletes expired messages and their associated voice files
 */
const startExpiryWorker = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        console.log('Running Expiry Worker...');
        try {
            const now = new Date();
            const expiredMessages = await Message.find({ expiresAt: { $lte: now } });

            for (const msg of expiredMessages) {
                // Delete file
                const fullPath = path.resolve(__dirname, '..', msg.filePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                    console.log(`Deleted file: ${msg.filePath}`);
                }

                // Hard delete message record
                await Message.deleteOne({ _id: msg._id });
                console.log(`Deleted message record: ${msg._id}`);
            }
        } catch (error) {
            console.error('Error in Expiry Worker:', error);
        }
    });
};

module.exports = startExpiryWorker;
