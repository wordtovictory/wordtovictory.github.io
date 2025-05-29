import BibleService from './BibleService';

class MongoDBBibleService extends BibleService {
    constructor(baseUrl) {
        super();
        this.baseUrl = baseUrl || process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    }

    async getBibleRecords(userId) {
        try {
            const response = await fetch(`${this.baseUrl}/bible/records`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch Bible records');
            }

            const data = await response.json();
            return data.readStatus;
        } catch (error) {
            console.error('Error fetching Bible records:', error);
            throw error;
        }
    }

    async updateBibleRecords(userId, readStatus) {
        try {
            const response = await fetch(`${this.baseUrl}/bible/records`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ readStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update Bible records');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating Bible records:', error);
            throw error;
        }
    }
}

export default MongoDBBibleService; 