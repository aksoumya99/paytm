const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    const db_url = 'mongodb://localhost:27017/paytm';
    await mongoose.connect(db_url).then(() => {
        console.log('Connected to the database');
    });
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

const User = mongoose.Model('User', userSchema);

module.exports = { 
    User 
};