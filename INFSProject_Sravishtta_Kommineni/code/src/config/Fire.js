const firebase = require('firebase/app');
require('firebase/auth');
require("firebase/firestore");


const config = {
    apiKey: "AIzaSyCKyLVr_SzEdFgBzh5UcOLBWuN7AflJTxU",
    authDomain: "stocker-fd6a1.firebaseapp.com",
    databaseURL: "https://stocker-fd6a1.firebaseio.com",
    projectId: "stocker-fd6a1",
    storageBucket: "stocker-fd6a1.appspot.com",
    messagingSenderId: "35126089620",
    appId: "1:35126089620:web:91f0b609d8fdd96883e181",
    measurementId: "G-K32J2N5K4J"
};

firebase.initializeApp(config);
let db = firebase.firestore();
db.settings({timestampsInSnapshots: true});
let auth = firebase.auth();


export default {
    firestore: db,
    auth: auth
}





;
