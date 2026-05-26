import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

const firebaseConfig = {

  apiKey: "AIzaSyD4UFkb9HOP3cpvDjicmshdSlvap3Qcm-I",

  authDomain: "aiforge-3bc8e.firebaseapp.com",

  projectId: "aiforge-3bc8e",

  storageBucket: "aiforge-3bc8e.firebasestorage.app",

  messagingSenderId: "22301866129",

  appId: "1:22301866129:web:5122a9072a6ea8ac042a30"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);