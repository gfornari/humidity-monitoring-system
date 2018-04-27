#include <Poco/Exception.h>
#include <Poco/JSON/Object.h>
#include <Poco/Net/DNS.h>

#include <iostream>
#include <ctime>
#include <string>
#include <future>
#include <wiringPi.h>


#include "firebase/FirebaseAPI.h"
#include "firebase/FirebaseHelper.h"
#include "sqlite/SqliteControllerAPI.h"
#include "decoder_rasp/Dr.h"



int main(int argc, char** argv) {
  try {

    // if (isInternetConnectionAvailable()) {
    //   std::cout << "Internet connection available" << std::endl;

    //   // std::future<int> fut = std::async(runQuery, "cappellaborgoricco");

    //   // std::cout << "Doing the request ..." << std::endl;
    //   // std::cout << "Request value: " << fut.get() << std::endl;

    //   time_t  timev;
    //   time(&timev);

    //Poco::JSON::Object::Ptr obj = FirebaseHelper::buildMeasurement(
    //     "cappellaborgoricco",
    //     "0", 35, 49,
    //     timev);
    //   FirebaseAPI::runQuery("cappellaborgoricco");

    //   // FirebaseAPI::createDocument(obj);
    // } else {
    //   std::cout << "Internet connection not available" << std::endl;
    // }

    // // SqliteControllerAPI sq;
    // // sq.createDataTable();
    // // time_t timev;
    // // time(&timev);
    // // for(int i=0;i<50;i++)
    // // {
    // //   Measure sensore1("CappellaBorgoricco",55+i,25,"3",timev);
    // //   sq.insert(sensore1);
    // // }

    // //   Measure sensore1("CappellaBorgoricco",55,25,"3",timev);
    // //   sq.selectSince(sensore1,155864);

    // decoder_rasp dc;

    // while(true)
    // {
    //   dc.loop();

    // }

    if(wiringPiSetup() == -1) {
      printf("no wiring pi detected\n");
      return 0;
	  }

    printf("first time handler attached");

    SqliteControllerAPI sq;
    sq.createDataTable();

    wiringPiISR(DATAPIN,INT_EDGE_BOTH,&handler);
    while(true) {
      loop(sq);
    }


    //oppure
    //SqliteControllerAPI* p = new SqliteControllerAPI();
    //p->createDataTable();

    //oppure anche
    //SqliteControllerAPI q;
    //q.createDataTable();

  } catch(Poco::Exception& exc) {
    std::cerr << exc.displayText() << std::endl;
    return 1;
  } catch(std::exception& exc) {
    std::cerr << exc.what() << std::endl;
    return 1;
  }
  return 0;
}
