const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    const serviceAccount = require('../word-to-victory-dev-firebase-adminsdk-fbsvc-d1e611e4e1.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized');
}

const authenticateToken = async (req, res, next) => {
    console.log('Auth middleware called');
    const authHeader = req.headers['authorization'];
    console.log('Auth header:', authHeader);
    
    if (!authHeader) {
        console.log('No authorization header found');
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    console.log('Token extracted:', token ? 'Token exists' : 'No token');

    try {
        console.log('Verifying token...');
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log('Token verified successfully');
        console.log('Decoded token:', {
            uid: decodedToken.uid,
            email: decodedToken.email
        });
        
        req.user = {
            userId: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name
        };
        return next();
    } catch (error) {
        console.error('Firebase token verification failed:', error);
        res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = { authenticateToken }; 