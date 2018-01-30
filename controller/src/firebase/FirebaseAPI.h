#ifndef FIREBASEAPI_H
#define FIREBASEAPI_H

#include <string>

#include <Poco/JSON/Object.h>

class FirebaseAPI {
  private:
    static int httpPOST(std::string url, Poco::JSON::Object::Ptr obj);
  public:
    static int runQuery(std::string buildingId);
    static int createDocument(Poco::JSON::Object::Ptr obj);
};


#endif //FIREBASEAPI_H
