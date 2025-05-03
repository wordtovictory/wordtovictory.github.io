const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    const serviceAccount = require('../word-to-victory-dev-firebase-adminsdk-fbsvc-d1e611e4e1.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
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