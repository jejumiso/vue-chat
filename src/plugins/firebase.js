import Vue from 'vue';
// import * as firebase from 'firebase/app';
import firebase from 'firebase/app'; //윗줄이랑 버전별로 되는게 있고 함...

import 'firebase/auth';
import 'firebase/firebase-database';
import firebaseConfig from '@/../firebaseConfig.js';

firebase.initializeApp(firebaseConfig);
Vue.prototype.$firebase = firebase;
