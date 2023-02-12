const firebase = require('firebase');

const firebaseConfig = {
    apiKey: "AIzaSyAhByZ93x2XREneD0dBviPt81zhfl8fIcA",
    authDomain: "fir-withdesktopcaro.firebaseapp.com",
    projectId: "fir-withdesktopcaro",
    storageBucket: "fir-withdesktopcaro.appspot.com",
    messagingSenderId: "1086005723413",
    appId: "1:1086005723413:web:6501b3931b9e60f0bee91c"
  };
const db = firebase.initializeApp(firebaseConfig);

module.exports = db;