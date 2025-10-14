import {initializeApp} from 'firebase/app'
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCOTvRJcDVtANv6SguglyXKQANRBvVh3NA",
  authDomain: "pathguardian-7edad.firebaseapp.com",
  projectId: "pathguardian-7edad",
  storageBucket: "pathguardian-7edad.firebasestorage.app",
  messagingSenderId: "391721273845",
  appId: "1:391721273845:web:f856b78b7b23290cedf8bc",
  measurementId: "G-Z07FMFMRTX",
  datebaseURL: 'https://pathguardian-7edad-default-rtdb.firebaseio.com/'
};
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);