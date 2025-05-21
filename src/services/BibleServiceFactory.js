import MongoDBBibleService from './MongoDBBibleService';
import FirebaseBibleService from './FirebaseBibleService';

class BibleServiceFactory {
    static createService(type = 'firebase') {
        switch (type.toLowerCase()) {
            case 'mongodb':
                return new MongoDBBibleService();
            case 'firebase':
                return new FirebaseBibleService();
            default:
                throw new Error(`Unknown service type: ${type}`);
        }
    }
}

export default BibleServiceFactory; 