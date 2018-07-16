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
  } catch(Poco::Exception& exc) {
    std::cerr << exc.displayText() << std::endl;
    return 1;
  } catch(std::exception& exc) {
    std::cerr << exc.what() << std::endl;
    return 1;
  }
  return 0;
}
