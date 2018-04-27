#include <wiringPi.h>
#include <stdlib.h>
#include <stdio.h>

#include "../sqlite/SqliteControllerAPI.h"
#include "../sync/Synchronizer.h"


#define RING_BUFFER_SIZE  256

#define SYNC_LENGTH  3900
#define SEP_LENGTH   450
#define BIT1_LENGTH  1900
#define BIT0_LENGTH  950

#define DATAPIN  2  // D2 is interrupt GPI027 Pi.rev2

unsigned long timings[RING_BUFFER_SIZE];
unsigned int syncIndex1 = 0;  // index of the first sync signal
unsigned int syncIndex2 = 0;  // index of the second sync signal
bool received = false;

bool sync1 = false;
bool sync2 = false;
unsigned int cc;


bool isInternetConnectionAvailable() {
  try {
    Poco::Net::DNS::resolve("firestore.googleapis.com");
    return true;
  } catch(Poco::Exception& e) {
    return false;
  }
}


// detect if a sync signal is present
bool isSync(unsigned int idx) {
  unsigned long t0 = timings[(idx+RING_BUFFER_SIZE-1) % RING_BUFFER_SIZE];
  unsigned long t1 = timings[idx];

  // on the temperature sensor, the sync signal
  // is roughtly 4.0ms. Accounting for error
  // it should be within 3.0ms and 5.0ms
  if (t0>(SEP_LENGTH-100) && t0<(SEP_LENGTH+100) &&
    t1>(SYNC_LENGTH-1000) && t1<(SYNC_LENGTH+1000) &&
    digitalRead(DATAPIN) == HIGH) {
    return true;
  }
  return false;
}

/* Interrupt 1 handler */
void handler() {
  static unsigned long duration = 0;
  static unsigned long lastTime = 0;
  static unsigned int ringIndex = 0;
  static unsigned int syncCount = 0;

  // ignore if we haven't processed the previous received signal
  if (received == true) {
    return;
  }
  // calculating timing since last change
  long time = micros();
  duration = time - lastTime;
  lastTime = time;

  // store data in ring buffer
  ringIndex = (ringIndex + 1) % RING_BUFFER_SIZE;
  timings[ringIndex] = duration;

  // detect sync signal
  if (isSync(ringIndex)) {
    syncCount ++;


    // first time sync is seen, record buffer index
    if (syncCount == 1) {
      syncIndex1 = (ringIndex+1) % RING_BUFFER_SIZE;
      sync1 = true;
    }
    else if (syncCount == 2) {
      // second time sync is seen, start bit conversion
      sync2 = true;
      syncCount = 0;
      sync1 = false;
      sync2 = false;
      syncIndex2 = (ringIndex+1) % RING_BUFFER_SIZE;
      unsigned int changeCount = (syncIndex2 < syncIndex1) ? (syncIndex2+RING_BUFFER_SIZE - syncIndex1) : (syncIndex2 - syncIndex1);
      cc = changeCount;
      // changeCount must be 66 -- 32 bits x 2 + 2 for sync
      if (changeCount != 74 ) {
        received = false;
        syncIndex1 = 0;
        syncIndex2 = 0;

      }
      else {
        received = true;

      }
    }

  }
}




//This function is used to convert duration stored in timings, in bit
int t2b(unsigned int t0, unsigned int t1) {
 //Separation gap between two rising edge is 0.45ms
 if (t0>(SEP_LENGTH-100) && t0<(SEP_LENGTH+100)) {
        //Bit 1 stay up around 1.9ms
        if (t1>(BIT1_LENGTH-100) && t1<(BIT1_LENGTH+100)) {

          return 1;
        }
        //Bit 1 stay up around 0.95ms
        else if (t1>(BIT0_LENGTH-100) && t1<(BIT0_LENGTH+100)) {
          return 0;
        }
        else {
          return -1;
        }
      }
      else {
         return -1;
      }
}


void loop(SqliteControllerAPI sq) {



  if (received == true) {
   printf("Handler detached\n");
    // disable interrupt to avoid new data corrupting the buffer
    system("/usr/local/bin/gpio edge 2 none");


// loop over buffer data ==> This is no longer needed, since now we want to print out the converted measure.
//    int c=0;
//    for(unsigned int i=syncIndex1,c =0; i!=syncIndex2; i=(i+2)%RING_BUFFER_SIZE,c++) {
//      unsigned long t0 = timings[i], t1 = timings[(i+1)%RING_BUFFER_SIZE];
//      if (t0>(SEP_LENGTH-100) && t0<(SEP_LENGTH+100)) {
//       if (t1>(BIT1_LENGTH-100) && t1<(BIT1_LENGTH+100)) {
//         Serial.print("1");
//       } else if (t1>(BIT0_LENGTH-100) && t1<(BIT0_LENGTH+100)) {
//         Serial.print("0");
//       } else {
//         Serial.print("SYNC");  // sync signal
//       }
//       } else {
//       Serial.print("?");  // undefined timing
//       }
//       if (c%8==7) Serial.print(" ");
//    }
//    Serial.println("");

    //Decoding Channels
    //Channel is write in the very first part of the first and second byte
    //01110000 10100000 01110110 11110011 0010SYNC  11.8C 50%
    //01110000 1010<== Channel bits

    unsigned int startIndex, stopIndex;
    unsigned long channel = 0;
    bool fail = false;

    startIndex = (syncIndex1 + (1*8+0)*2) % RING_BUFFER_SIZE;
    stopIndex  = (syncIndex1 + (1*8+8)*2) % RING_BUFFER_SIZE;
    for(unsigned int i=startIndex; i!=stopIndex; i=(i+2)%RING_BUFFER_SIZE) {
      int bit = t2b(timings[i], timings[(i+1)%RING_BUFFER_SIZE]);
      channel = (channel<<1) + bit;
      if (bit < 0)  fail = true;
    }

    if (fail) {printf("Decoding error.");}
    else {
      printf("Channel: ");
      //printf((int)(((channel)/8)-16)/2);
      printf("Channel: %d \n",(int)(((channel)/8)-16)/2);
    }


    //Decoding Humidity
    //Humidity is write in the last byte plus other four bit before a SYNC
    //01110000 10100000 01110110 11110011 0010SYNC  11.8C 50%
    //                           11110011 0010<== Humidity
    unsigned long humidity = 0;
    fail = false;
    startIndex = (syncIndex1 + (3*8+4)*2) % RING_BUFFER_SIZE;
    stopIndex =  (syncIndex1 + (3*8+12)*2) % RING_BUFFER_SIZE;

    for(unsigned int i=startIndex; i!=stopIndex; i=(i+2)%RING_BUFFER_SIZE) {
      int bit = t2b(timings[i], timings[(i+1)%RING_BUFFER_SIZE]);
      humidity = (humidity<<1) + bit;
      if (bit < 0)  fail = true;
    }
    if (fail) {printf("Decoding error.");}
    else {
      printf("Humidity: %lu  \n ",humidity);
    }

    //Decoding Temperature
    //Humidity is write in the middle byte
    //01110000 10100000 01110110 11110011 0010SYNC  11.8C 50%
    //             0000 01110110<== Temperature
    unsigned long temp = 0;
    fail = false;
    // most significant 4 bits
    startIndex = (syncIndex1 + (1*8+4)*2) % RING_BUFFER_SIZE;
    stopIndex  = (syncIndex1 + (2*8+8)*2) % RING_BUFFER_SIZE;
    for(unsigned int i=startIndex; i!=stopIndex; i=(i+2)%RING_BUFFER_SIZE) {
      int bit = t2b(timings[i], timings[(i+1)%RING_BUFFER_SIZE]);
      temp = (temp<<1) + bit;
      if (bit < 0)  fail = true;
    }

    if (fail) {printf("Decoding error.");}

    else {

      printf("Temperature: ");
	    printf("Temperature: %.6f C \n",(float)(temp)/10);
      //printf("Temperature: %d C  %d F\n",(int)((temp-1024)/10+1.9+.5),(int)(((temp-1024)/10+1.
    }


    time_t timev;
    time(&timev);

    const char* buildingId = std::getenv("BUILDING_ID");
    if(buildingId == NULL) {
      throw "Environmental variable not found: BUILDING_ID";
    }

    Measure measure(buildingId,(int)humidity,(int)temp,std::to_string(channel),timev);
    int last_id = sq.insert(measure);

    if(isInternetConnectionAvailable()) {
      std::cout << "Internet connection available" << std::endl;
      Synchronizer::sync(&sq);

      Poco::JSON::Object::Ptr obj = FirebaseHelper::buildMeasurement(
        buildingId,
        std::to_string(channel), (int)humidity,(int)temp,
        timev);

      int status = FirebaseAPI::createDocument(obj);

      std::cout << "status " << status << std::endl;

      if(status == 200) {
        sq.deleterow(last_id);
      }

    } else {
      std::cout << "Internet connection not available" << std::endl;
    }

    // delay for 1 second to avoid repetitions
    delay(1000);
    received = false;
    syncIndex1 = 0;
    syncIndex2 = 0;

    // re-enable interrupt
    printf("Handler re-attached\n");
   // Error in the original code
   // wiringPiISR(DATAPIN,INT_EDGE_BOTH,&handler);
  }
}