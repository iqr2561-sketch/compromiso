import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { execSync } from 'child_process';

async function createAdmin() {
    console.log('🔑 Creando usuario administrador en Firestore...');

    // Get access token from gcloud
    const token = execSync('gcloud auth print-access-token', { encoding: 'utf-8' }).trim();

    // Get project ID
    const projectId = 'compromisodiario';
    const databaseId = 'compromiso';

    // Use REST API to create the document
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/admins?documentId=admin_redaccion`;

    const body = {
        fields: {
            username: { stringValue: 'redaccion' },
            password: { stringValue: 'admin' },
            name: { stringValue: 'Redacción Compromiso' },
            recovery_code: { stringValue: 'COMPROMISO-2026' },
            failed_attempts: { integerValue: '0' },
            created_at: { stringValue: new Date().toISOString() }
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const result = await response.json();

        if (response.ok) {
            console.log('✅ Usuario administrador creado exitosamente!');
            console.log('-----------------------------------');
            console.log('Usuario: redaccion');
            console.log('Password: admin');
            console.log('-----------------------------------');
            console.log('Documento ID:', result.name);
        } else {
            console.error('❌ Error:', result.error?.message || JSON.stringify(result));
        }
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
    }
}

createAdmin();
