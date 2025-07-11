const mongoose = require('mongoose');

const database = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/vehicle', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

module.exports = database; 
