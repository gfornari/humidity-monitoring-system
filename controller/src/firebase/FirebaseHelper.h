#ifndef FIREBASEHELPER_H
#define FIREBASEHELPER_H

#include <string>

#include <Poco/JSON/Object.h>

class FirebaseHelper {
  private:
    static Poco::JSON::Object::Ptr buildTimestampValue(time_t timestamp);
    static Poco::JSON::Object::Ptr buildIntegerValue(int integerValue);
    static Poco::JSON::Object::Ptr buildStringValue(std::string stringValue);
    static Poco::JSON::Object::Ptr buildSelect();
    static Poco::JSON::Object::Ptr buildWhere(std::string buildingId);
    static Poco::JSON::Array::Ptr buildFrom();
    static Poco::JSON::Array::Ptr buildOrderBy();
  public:
    static Poco::JSON::Object::Ptr buildMeasurement(std::string buildingId, std::string sensorId, int humidity, int temperature, time_t timestamp);
    static Poco::JSON::Object::Ptr buildStructuredQuery(std::string buildingId);
};


#endif //FIREBASEHELPER_H
