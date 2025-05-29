const express = require('express');
const router = express.Router();
const BibleRecord = require('../models/BibleRecord');
const { authenticateToken } = require('../middleware/auth');

// Get user's Bible reading records
router.get('/records', authenticateToken, async (req, res) => {
    console.log('GET /records route called');
    console.log('User ID:', req.user.userId);
    
    try {
        console.log('Searching for Bible records...');
        let bibleRecord = await BibleRecord.findOne({ userId: req.user.userId });
        console.log('Bible record found:', bibleRecord ? 'Yes' : 'No');
        
        if (!bibleRecord) {
            console.log('Creating new Bible record for user');
            bibleRecord = new BibleRecord({ 
                userId: req.user.userId,
                readStatus: new Map()
            });
            await bibleRecord.save();
            console.log('New Bible record created');
        }
        
        console.log('Returning records');
        res.json({ readStatus: Object.fromEntries(bibleRecord.readStatus) });
    } catch (error) {
        console.error('Error in GET /records:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Bible reading records
router.post('/records', authenticateToken, async (req, res) => {
    console.log('POST /records route called');
    console.log('User ID:', req.user.userId);
    console.log('Request body:', req.body);
    
    try {
        const { readStatus } = req.body;
        
        console.log('Searching for existing Bible record...');
        let bibleRecord = await BibleRecord.findOne({ userId: req.user.userId });
        console.log('Existing record found:', bibleRecord ? 'Yes' : 'No');
        
        if (!bibleRecord) {
            console.log('Creating new Bible record');
            bibleRecord = new BibleRecord({ userId: req.user.userId });
        }

        console.log('Updating readStatus');
        bibleRecord.readStatus = new Map(Object.entries(readStatus));
        await bibleRecord.save();
        console.log('Record saved successfully');

        res.json({ message: 'Records updated successfully' });
    } catch (error) {
        console.error('Error in POST /records:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 