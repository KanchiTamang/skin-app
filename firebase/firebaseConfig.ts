import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDANNC6KE2_ABPzcDEyEWB39SD-gAz6p2g',
  authDomain: 'my-skin-app-9b559.firebaseapp.com',
  projectId: 'my-skin-app-9b559',
  storageBucket: 'my-skin-app-9b559.appspot.com',
  messagingSenderId: '582340342442',
  appId: '1:582340342442:web:10f59d949984e2dba456d3',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
