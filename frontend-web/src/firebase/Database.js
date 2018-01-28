import * as moment from 'moment';

class Database {
  constructor(firestoreInstance) {
    this.firestore = firestoreInstance;
  }

  getBuildingMeasurementsSince(buildingId, sinceNumber, sinceUnit) {
    const since = moment().subtract(sinceNumber, sinceUnit).valueOf();
    return this.firestore
      .collection('measurements')
      .where('buildingId', '==', buildingId)
      .where('timestamp', '>=', since)
      .get();
  }

  /**
   * The returned function can be used to unsubscribe the listener. For example:
   *
   * const unsubscribe = db.onSnapshot('mybuildingId', console.log);
   * // ...
   * // Stop listening to changes
   * unsubscribe()
   */
  onNewSnapshots(buildingId, cb) {
    return this.firestore
      .collection('measurements')
      .where('buildingId', '==', buildingId)
      .where('timestamp', '>=', moment().valueOf())
      .onSnapshot(cb);
  }
}

export default Database;