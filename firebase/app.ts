import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import config from './config';

let app: FirebaseApp;

if (!getApps().length) {
    app = initializeApp(config);
} else {
    app = getApp();
}

export default app;
