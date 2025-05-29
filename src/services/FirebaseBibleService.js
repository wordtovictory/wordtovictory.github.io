import BibleService from './BibleService';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

class FirebaseBibleService extends BibleService {
    constructor() {
        super();
        this.db = getFirestore();
        this.auth = getAuth();
    }

    async getBibleRecords(userId) {
        try {
            console.log('Fetching records for user:', userId);
            const userDoc = doc(this.db, 'bibleRecords', userId);
            const docSnap = await getDoc(userDoc);

            if (!docSnap.exists()) {
                console.log('No existing records found for user:', userId);
                // Create a new record if it doesn't exist
                await setDoc(userDoc, { readStatus: {} });
                return {};
            }

            const data = docSnap.data();
            console.log('Retrieved data from Firebase:', data);
            const readStatus = data.readStatus || {};
            console.log('Returning readStatus:', readStatus);
            return readStatus;
        } catch (error) {
            console.error('Error fetching Bible records from Firebase:', error);
            throw error;
        }
    }

    async updateBibleRecords(userId, readStatus) {
        try {
            console.log('Updating records for user:', userId);
            console.log('Current readStatus to save:', readStatus);
            
            const userDoc = doc(this.db, 'bibleRecords', userId);
            
            // First, get the current document to ensure we're not overwriting anything
            const docSnap = await getDoc(userDoc);
            const currentData = docSnap.exists() ? docSnap.data() : { readStatus: {} };
            console.log('Current data in Firebase:', currentData);
            
            // Merge the new readStatus with the existing data
            const updatedData = {
                ...currentData,
                readStatus: {
                    ...currentData.readStatus,
                    ...readStatus
                }
            };
            
            console.log('Saving updated data to Firebase:', updatedData);
            await setDoc(userDoc, updatedData);
            return { message: 'Records updated successfully' };
        } catch (error) {
            console.error('Error updating Bible records in Firebase:', error);
            throw error;
        }
    }
}

export default FirebaseBibleService; 