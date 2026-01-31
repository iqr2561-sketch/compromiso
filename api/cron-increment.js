import db from './lib/firestore.js';

export default async function handler(req, res) {
    const settingsCol = db.collection('settings');

    try {
        // Get relevant settings
        const snapshot = await settingsCol.get();
        const settings = {};
        snapshot.docs.forEach(doc => {
            settings[doc.id] = doc.data().value;
        });

        // Check if auto-increment is disabled
        const autoIncrement = settings.edition_auto_increment !== 'false';
        const manualOverride = settings.edition_manual_override;
        const today = new Date().toISOString().split('T')[0];

        // Manual mode
        if (!autoIncrement && manualOverride) {
            res.status(200).json({
                success: true,
                message: 'Manual edition mode active',
                currentNumber: manualOverride,
                mode: 'manual'
            });
            return;
        }

        // Auto-increment mode: only increment once per day
        if (autoIncrement && settings.last_increment_date !== today) {
            const currentNumber = parseInt(settings.edition_number || '42891');
            const newNumber = currentNumber + 1;

            const batch = db.batch();
            batch.set(settingsCol.doc('edition_number'), { value: newNumber.toString(), updatedAt: new Date().toISOString() });
            batch.set(settingsCol.doc('cover_page_date'), { value: today, updatedAt: new Date().toISOString() });
            batch.set(settingsCol.doc('last_increment_date'), { value: today, updatedAt: new Date().toISOString() });
            await batch.commit();

            res.status(200).json({
                success: true,
                message: `Edition incremented to ${newNumber}`,
                newNumber,
                mode: 'auto'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Already incremented today',
            currentNumber: settings.edition_number,
            mode: 'auto'
        });
    } catch (error) {
        console.error('Cron Firestore Error:', error);
        res.status(500).json({ error: error.message });
    }
}

