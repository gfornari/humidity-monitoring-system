#include "Synchronizer.h"

#include <iostream>

#include "../firebase/FirebaseAPI.h"
#include "../firebase/FirebaseHelper.h"

void Synchronizer::sync(SqliteControllerAPI* sq) {
  std::cout << "Syncing ..." << std::endl;

  Measure measure;
  Statement select = sq -> selectAll(measure);

  int rowsAffected = select.execute();

  while (rowsAffected > 0) {
    std::cout
      << measure.rowid << " "
      << measure.buildingId << " "
      << measure.sensorId << " "
      << measure.humidity << " "
      << measure.temperature << " "
      << measure.timestamp << std::endl;

    Poco::JSON::Object::Ptr obj = FirebaseHelper::buildMeasurement(
      measure.buildingId, measure.sensorId, measure.humidity,
      measure.temperature, measure.timestamp);

    int status = FirebaseAPI::createDocument(obj);
    if (status == 200) {
      sq -> deleterow(measure.rowid);
    }

    rowsAffected = select.execute();
  }

  std::cout << "End syncing." << std::endl;
}