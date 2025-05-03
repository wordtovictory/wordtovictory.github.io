const mongoose = require('mongoose');

const bibleRecordSchema = new mongoose.Schema({
    userId: {
        type: String,  // Changed from ObjectId to String for Firebase UID
        required: true,
        unique: true
    },
    readStatus: {
        type: Map,
        of: Boolean,
        default: new Map()
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Update lastUpdated timestamp before saving
bibleRecordSchema.pre('save', function(next) {
    this.lastUpdated = new Date();
    next();
});

module.exports = mongoose.model('BibleRecord', bibleRecordSchema); 