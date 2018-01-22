import * as firebase from 'firebase';
/**
 * we have to manually include it since it is not included by default in the
 * firebase wrapper package (but it is in its dependencies)
 */
import '@firebase/firestore';
import Database from './Database';

class Firebase {
  constructor() {
    const config = {
      apiKey: "AIzaSyAlXk-lVeGKe9574UulbNZz6iZC5jm_TZI",
      authDomain: "humidity-monitoring-system.firebaseapp.com",
      databaseURL: "https://humidity-monitoring-system.firebaseio.com",
      projectId: "humidity-monitoring-system",
      storageBucket: "humidity-monitoring-system.appspot.com",
      messagingSenderId: "516055515099",
    };

    // TODO seems it is synchronous. Can we make it async?
    this.app = firebase.initializeApp(config);
  }

  getDB() {
    if (!this.db) {
      this.db = new Database(this.app.firestore());
    }

    return this.db;
  }
}

export default Firebase;