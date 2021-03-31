import Vue from 'vue';
import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firebase-database';
import firebaseConfig from '../../firebaseConfig.js';

firebase.initializeApp(firebaseConfig);
//initializeApp
Vue.prototype.$firebase = firebase;
