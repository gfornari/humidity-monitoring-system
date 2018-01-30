#include "FirebaseHelper.h"

Poco::JSON::Object::Ptr FirebaseHelper::buildTimestampValue(const time_t timestamp) {
  Poco::JSON::Object::Ptr obj = new Poco::JSON::Object;
  // std::to_string(timestamp) returns seconds, so we add "000" to convert it to
  // milliseconds
  obj -> set("integerValue", std::to_string(timestamp) + "000");
  return obj;
}

Poco::JSON::Object::Ptr FirebaseHelper::buildIntegerValue(const int integerValue) {
  Poco::JSON::Object::Ptr obj = new Poco::JSON::Object;
  obj -> set("integerValue", std::to_string(integerValue));
  return obj;
}

Poco::JSON::Object::Ptr FirebaseHelper::buildStringValue(const std::string stringValue) {
  Poco::JSON::Object::Ptr obj = new Poco::JSON::Object;
  obj -> set("stringValue", stringValue);
  return obj;
}

Poco::JSON::Object::Ptr FirebaseHelper::buildMeasurement(const std::string buildingId, const std::string sensorId, const int humidity, const int temperature, const time_t timestamp) {
  Poco::JSON::Object::Ptr obj = new Poco::JSON::Object;

  Poco::JSON::Object::Ptr fields = new Poco::JSON::Object;
  obj -> set("fields", fields);

  fields -> set("buildingId", buildStringValue(buildingId));
  fields -> set("sensorId", buildStringValue(sensorId));
  fields -> set("humidity", buildIntegerValue(humidity));
  fields -> set("temperature", buildIntegerValue(temperature));
  fields -> set("timestamp", buildTimestampValue(timestamp));

  return obj;
}

Poco::JSON::Object::Ptr FirebaseHelper::buildSelect() {
    Poco::JSON::Object::Ptr select = new Poco::JSON::Object;

    Poco::JSON::Array::Ptr fields = new Poco::JSON::Array;
    select -> set("fields", fields);

    Poco::JSON::Object::Ptr timestamp = new Poco::JSON::Object;
    timestamp -> set("fieldPath", "timestamp");
    fields -> add(timestamp);

    return select;
}

Poco::JSON::Array::Ptr FirebaseHelper::buildFrom() {
    Poco::JSON::Array::Ptr from = new Poco::JSON::Array;

    Poco::JSON::Object::Ptr measurements = new Poco::JSON::Object;
    measurements -> set("collectionId", "measurements");
    measurements -> set("allDescendants", false);
    from -> add(measurements);

    return from;
}

Poco::JSON::Object::Ptr FirebaseHelper::buildWhere(const std::string buildingId) {
    Poco::JSON::Object::Ptr where = new Poco::JSON::Object;

    Poco::JSON::Object::Ptr fieldFilter = new Poco::JSON::Object;
    where -> set("fieldFilter", fieldFilter);

    Poco::JSON::Object::Ptr field = new Poco::JSON::Object;
    field -> set("fieldPath", "buildingId");

    Poco::JSON::Object::Ptr value = new Poco::JSON::Object;
    value -> set("stringValue", buildingId);

    fieldFilter -> set("field", field);
    fieldFilter -> set("op", "EQUAL");
    fieldFilter -> set("value", value);

    return where;
}

Poco::JSON::Array::Ptr FirebaseHelper::buildOrderBy() {
    Poco::JSON::Array::Ptr orderBy = new Poco::JSON::Array;
    Poco::JSON::Object::Ptr timestamp = new Poco::JSON::Object;
    Poco::JSON::Object::Ptr field = new Poco::JSON::Object;

    field -> set("fieldPath", "timestamp");

    timestamp -> set("field", field);
    timestamp -> set("direction", "DESCENDING");

    orderBy -> add(timestamp);

    return orderBy;
}

Poco::JSON::Object::Ptr FirebaseHelper::buildStructuredQuery(std::string const buildingId) {
    Poco::JSON::Object::Ptr obj = new Poco::JSON::Object;

    Poco::JSON::Object::Ptr structuredQuery = new Poco::JSON::Object;
    obj -> set("structuredQuery", structuredQuery);

    structuredQuery -> set("select", buildSelect());
    structuredQuery -> set("from", buildFrom());
    structuredQuery -> set("where", buildWhere(buildingId));
    structuredQuery -> set("orderBy", buildOrderBy());
    structuredQuery -> set("limit", 1);

    return obj;
}