import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import "firebase/compat/firestore"
import 'firebase/compat/storage'
import 'firebase/compat/functions'
import {firebaseConfig} from "./config";

firebase.initializeApp(firebaseConfig); // initialize with project config value
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const functions = firebase.functions();
export const snapshots = firebase.functions();
// 時間を取得できる。データの作成日時をこの関数で入れられると便利
export const FirebaseTimestamp = firebase.firestore.Timestamp;

