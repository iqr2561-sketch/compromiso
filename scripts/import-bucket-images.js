/**
 * Script to scan Google Cloud Storage bucket and import all images to Firestore gallery
 * This will make all WordPress-migrated images available in the admin panel
 */
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault()
    });
}

const dbId = process.env.FIRESTORE_DB_ID || 'compromiso';
console.log(`🔥 Using Firestore Database: ${dbId}`);
const db = getFirestore(dbId);

const BUCKET_NAME = process.env.GOOGLE_CLOUD_STORAGE_BUCKET || 'compromiso-diario-images';
const storage = new Storage();

// Image extensions to look for
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

async function scanBucketForImages() {
    console.log('🔍 Scanning bucket for images...\n');
    console.log(`📦 Bucket: ${BUCKET_NAME}`);

    const bucket = storage.bucket(BUCKET_NAME);
    const [files] = await bucket.getFiles({ prefix: 'uploads/' });

    const images = files.filter(file => {
        const name = file.name.toLowerCase();
        return IMAGE_EXTENSIONS.some(ext => name.endsWith(ext));
    });

    console.log(`\n📷 Found ${images.length} images in the bucket\n`);
    return images;
}

async function getExistingGalleryUrls() {
    console.log('📋 Fetching existing gallery entries...');
    try {
        const snapshot = await db.collection('gallery').get();
        const existingUrls = new Set();

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.url) {
                existingUrls.add(data.url);
            }
        });

        console.log(`   Found ${existingUrls.size} existing entries\n`);
        return existingUrls;
    } catch (error) {
        console.log('   No existing gallery found, starting fresh\n');
        return new Set();
    }
}

async function importImagesToGallery(images, existingUrls) {
    const galleryCol = db.collection('gallery');
    let imported = 0;
    let skipped = 0;
    let errors = 0;

    console.log('📥 Importing images to gallery...\n');

    // Process in smaller batches of 400 to be safe
    const batchSize = 400;
    let currentBatch = [];

    for (const file of images) {
        const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${file.name}`;

        // Skip if already exists
        if (existingUrls.has(publicUrl)) {
            skipped++;
            continue;
        }

        // Extract metadata from file path
        // Format: uploads/YYYY/MM/filename.jpg
        const pathParts = file.name.split('/');
        const filename = pathParts[pathParts.length - 1];
        const year = pathParts[1] || 'unknown';
        const month = pathParts[2] || 'unknown';

        // Create alt text from filename
        const altText = filename
            .replace(/[-_]/g, ' ')
            .replace(/\.[^.]+$/, '') // Remove extension
            .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words

        currentBatch.push({
            url: publicUrl,
            filename: filename,
            alt_text: altText,
            folder: `${year}/${month}`,
            source: 'wordpress-import',
            createdAt: new Date().toISOString(),
            importedAt: new Date().toISOString()
        });

        // Commit batch when it reaches the limit
        if (currentBatch.length >= batchSize) {
            try {
                const batch = db.batch();
                for (const item of currentBatch) {
                    const newDoc = galleryCol.doc();
                    batch.set(newDoc, item);
                }
                await batch.commit();
                imported += currentBatch.length;
                console.log(`   ✅ Committed batch of ${currentBatch.length} images (total: ${imported})`);
                currentBatch = [];
            } catch (error) {
                console.error(`   ❌ Batch error: ${error.message}`);
                errors += currentBatch.length;
                currentBatch = [];
            }
        }
    }

    // Commit remaining items
    if (currentBatch.length > 0) {
        try {
            const batch = db.batch();
            for (const item of currentBatch) {
                const newDoc = galleryCol.doc();
                batch.set(newDoc, item);
            }
            await batch.commit();
            imported += currentBatch.length;
            console.log(`   ✅ Committed final batch of ${currentBatch.length} images`);
        } catch (error) {
            console.error(`   ❌ Final batch error: ${error.message}`);
            errors += currentBatch.length;
        }
    }

    return { imported, skipped, errors };
}

async function main() {
    console.log('════════════════════════════════════════════════════════════');
    console.log('   📸 BUCKET TO GALLERY IMPORTER');
    console.log('════════════════════════════════════════════════════════════\n');

    try {
        // Step 1: Scan bucket for images
        const images = await scanBucketForImages();

        if (images.length === 0) {
            console.log('⚠️  No images found in the bucket. Nothing to import.');
            return;
        }

        // Step 2: Get existing gallery entries
        const existingUrls = await getExistingGalleryUrls();

        // Step 3: Import new images
        const { imported, skipped, errors } = await importImagesToGallery(images, existingUrls);

        // Summary
        console.log('\n════════════════════════════════════════════════════════════');
        console.log('   📊 IMPORT SUMMARY');
        console.log('════════════════════════════════════════════════════════════');
        console.log(`   ✅ Imported: ${imported} images`);
        console.log(`   ⏭️  Skipped (already exist): ${skipped} images`);
        console.log(`   ❌ Errors: ${errors} images`);
        console.log(`   📷 Total in bucket: ${images.length} images`);
        console.log('════════════════════════════════════════════════════════════\n');

        if (imported > 0) {
            console.log('🎉 Import completed! Images are now available in the Admin panel gallery.\n');
        }

    } catch (error) {
        console.error('\n❌ Fatal error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

main();
