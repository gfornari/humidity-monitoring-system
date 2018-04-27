#include "Synchronizer.h"

#include <iostream>

#include "../firebase/FirebaseAPI.h"
#include "../firebase/FirebaseHelper.h"

void Synchronizer::sync(SqliteControllerAPI* sq) {
  std::cout << "Syncing ..." << std::endl;

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

  std::cout << "End syncing." << std::endl;
}