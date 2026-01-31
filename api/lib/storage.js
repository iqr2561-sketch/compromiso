import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

const storage = new Storage();
const BUCKET_NAME = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;

/**
 * Uploads a base64 image string to Google Cloud Storage
 * @param {string} base64String 
 * @param {string} folder 
 * @returns {Promise<string>} The public URL of the uploaded image
 */
export const uploadImage = async (base64String, folder = 'uploads') => {
    if (!base64String || !base64String.startsWith('data:image/')) {
        return base64String; // Return as is if not a base64 image
    }

    if (!BUCKET_NAME) {
        console.warn('⚠️ GOOGLE_CLOUD_STORAGE_BUCKET not set. Storing Base64 in Firestore (Not recommended).');
        return base64String;
    }

    try {
        const bucket = storage.bucket(BUCKET_NAME);

        // Extract content type and data
        const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            throw new Error('Invalid base64 string');
        }

        const contentType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const extension = contentType.split('/')[1] || 'jpg';
        const fileName = `${folder}/${uuidv4()}.${extension}`;

        const file = bucket.file(fileName);
        await file.save(buffer, {
            metadata: { contentType: contentType },
            resumable: false
        });

        // Construct the public URL
        // Note: This assumes the bucket/file is publicly accessible or you use signed URLs.
        // For Cloud Run/Cloud Storage, you can make the bucket public-readable.
        return `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`;
    } catch (error) {
        console.error('Error uploading to Cloud Storage:', error);
        throw error;
    }
};
