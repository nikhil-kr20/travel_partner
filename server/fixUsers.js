const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

// Fix users without names
async function fixUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find all users
        const users = await User.find({});
        console.log(`Found ${users.length} users`);

        for (const user of users) {
            console.log(`\nUser ID: ${user._id}`);
            console.log(`Name: ${user.name || 'MISSING'}`);
            console.log(`Email: ${user.email}`);

            // If user doesn't have a name, extract from email
            if (!user.name) {
                const nameFromEmail = user.email.split('@')[0];
                user.name = nameFromEmail;
                await user.save();
                console.log(`✅ Fixed! Set name to: ${nameFromEmail}`);
            }
        }

        console.log('\n✅ All users checked and fixed!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixUsers();
