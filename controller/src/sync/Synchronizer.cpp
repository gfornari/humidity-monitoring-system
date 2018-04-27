#include "Synchronizer.h"

#include "../firebase/FirebaseAPI.h"
#include "../firebase/FirebaseHelper.h"

void Synchronizer::sync(SqliteControllerAPI* sq) {
  // see if there are scheduled jobs
  Measure measure;
  Statement select = sq -> selectAll(measure);

  while (!select.done()) {
    select.execute();

    Poco::JSON::Object::Ptr obj = FirebaseHelper::buildMeasurement(
      measure.buildingId,
      measure.sensorId, measure.humidity,measure.temperature,
      measure.timestamp);

    int status = FirebaseAPI::createDocument(obj);
    if (status == 200) {
      sq -> deleterow(measure.rowid);
    }
  }

  // send scheduled jobs

  // get most recent firebase doc

  // get all docs younger than firebase doc

  // if there are docs, send all docs retrived
    // if someone failed, reschedule them
}