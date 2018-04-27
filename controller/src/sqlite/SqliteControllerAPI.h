#ifndef SQLITECONTROLLERAPI_H
#define SQLITECONTROLLERAPI_H

#include "Poco/Data/Session.h"
#include "Poco/Data/SQLite/Connector.h"
#include <vector>
#include <iostream>
#include <string>

using namespace Poco::Data;

struct Measure
{
  std::string buildingId;
  int         humidity;
  int         temperature;
  std::string sensorId;
  time_t      timestamp;

  Measure(){};
  Measure(std::string buildingId, int humidity, int temperature, std::string sensorId , time_t timestamp) : 
    buildingId(buildingId), humidity(humidity), temperature(temperature),sensorId(sensorId),timestamp(timestamp) {};
};

class SqliteControllerAPI {
  private:
    Session* session;
    Statement select(Measure& data, std::string query);

  public:
    SqliteControllerAPI();
    int createDataTable();
    int insert(Measure data);
    Statement selectSince(Measure& data, time_t timestamp);
    int deleterow(int ID);
};

#endif //SQLITECONTROLLERAPI_H


