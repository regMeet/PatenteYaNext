import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import app from './app';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
