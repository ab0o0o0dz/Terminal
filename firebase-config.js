// Firebase Configuration
// استبدل هذه القيم بقيم مشروع Firebase الخاص بك

const firebaseConfig = {
    // API Key من Firebase Console > Project Settings > General
    apiKey: "YOUR_API_KEY",
    
    // Auth Domain من Firebase Console > Authentication > Sign-in method
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    
    // Database URL من Firebase Console > Realtime Database
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    
    // Project ID من Firebase Console > Project Settings > General
    projectId: "YOUR_PROJECT_ID",
    
    // Storage Bucket من Firebase Console > Storage
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    
    // Messaging Sender ID من Firebase Console > Project Settings > Cloud Messaging
    messagingSenderId: "YOUR_SENDER_ID",
    
    // App ID من Firebase Console > Project Settings > General
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase services
const auth = firebase.auth();
const database = firebase.database();

// Export for use in other files
window.firebaseAuth = auth;
window.firebaseDatabase = database;
