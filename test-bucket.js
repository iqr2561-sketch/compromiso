// Test script to verify Google Cloud Storage bucket connection
import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';

dotenv.config();

const BUCKET_NAME = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;

async function testBucketConnection() {
    console.log('🧪 Testing Google Cloud Storage connection...\n');

    if (!BUCKET_NAME) {
        console.error('❌ Error: GOOGLE_CLOUD_STORAGE_BUCKET not set in .env');
        process.exit(1);
    }

    console.log(`📦 Bucket name: ${BUCKET_NAME}`);

    try {
        const storage = new Storage();
        const bucket = storage.bucket(BUCKET_NAME);

        // Check if bucket exists
        const [exists] = await bucket.exists();
        if (!exists) {
            console.error('❌ Error: Bucket does not exist or you don\'t have access');
            process.exit(1);
        }
        console.log('✅ Bucket exists and is accessible');

        // Try to upload a test file
        const testFileName = 'test/connection-test.txt';
        const testContent = `Bucket connection test - ${new Date().toISOString()}`;

        console.log('📤 Uploading test file...');
        const file = bucket.file(testFileName);
        await file.save(testContent, {
            metadata: { contentType: 'text/plain' },
            resumable: false
        });

        console.log(`✅ Test file uploaded successfully!`);
        console.log(`   URL: https://storage.googleapis.com/${BUCKET_NAME}/${testFileName}`);

        // Clean up - delete test file
        console.log('🧹 Cleaning up test file...');
        await file.delete();
        console.log('✅ Test file deleted');

        console.log('\n🎉 SUCCESS! Bucket connection is working correctly!');
        console.log('   Images will now be uploaded to Google Cloud Storage.');

    } catch (error) {
        console.error('\n❌ Error:', error.message);

        if (error.message.includes('Could not load the default credentials')) {
            console.log('\n💡 Tip: You need to authenticate with Google Cloud.');
            console.log('   Run: gcloud auth application-default login');
        } else if (error.message.includes('does not have storage.objects')) {
            console.log('\n💡 Tip: Your account doesn\'t have write permissions to the bucket.');
            console.log('   Add Storage Object Admin role to your account/service account.');
        }

        process.exit(1);
    }
}

testBucketConnection();
