const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const BibleRecord = require('../models/BibleRecord');

// Middleware to authenticate requests
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Get user's Bible reading records
router.get('/records', authenticateToken, async (req, res) => {
    try {
        const bibleRecord = await BibleRecord.findOne({ userId: req.user.userId });
        if (!bibleRecord) {
            return res.status(404).json({ message: 'No records found' });
        }
        res.json({ readStatus: Object.fromEntries(bibleRecord.readStatus) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Bible reading records
router.post('/records', authenticateToken, async (req, res) => {
    try {
        const { readStatus } = req.body;
        
        let bibleRecord = await BibleRecord.findOne({ userId: req.user.userId });
        if (!bibleRecord) {
            bibleRecord = new BibleRecord({ userId: req.user.userId });
        }

        // Update readStatus
        bibleRecord.readStatus = new Map(Object.entries(readStatus));
        await bibleRecord.save();

        res.json({ message: 'Records updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 