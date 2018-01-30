#include <Poco/Exception.h>
#include <Poco/JSON/Object.h>
#include <Poco/Net/DNS.h>

#include <iostream>
#include <ctime>
#include <string>
#include <future>

#include "firebase/FirebaseAPI.h"
#include "firebase/FirebaseHelper.h"

bool isInternetConnectionAvailable() {
  try {
    Poco::Net::DNS::resolve("firestore.googleapis.com");
    return true;
  } catch(Poco::Exception& e) {
    return false;
  }
}

int main(int argc, char** argv) {
  try {
    if (isInternetConnectionAvailable()) {
      std::cout << "Internet connection available" << std::endl;

      // std::future<int> fut = std::async(runQuery, "cappellaborgoricco");

      // std::cout << "Doing the request ..." << std::endl;
      // std::cout << "Request value: " << fut.get() << std::endl;

      time_t  timev;
      time(&timev);

      Poco::JSON::Object::Ptr obj = FirebaseHelper::buildMeasurement(
        "cappellaborgoricco",
        "0", 35, 49,
        timev);
      FirebaseAPI::runQuery("cappellaborgoricco");

      // FirebaseAPI::createDocument(obj);
    } else {
      std::cout << "Internet connection not available" << std::endl;
    }
  } catch(Poco::Exception& exc) {
    std::cerr << exc.displayText() << std::endl;
    return 1;
  }
  return 0;
}
