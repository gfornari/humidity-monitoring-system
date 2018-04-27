#ifndef SYNCHRONIZER_H
#define SYNCHRONIZER_H

#include <string>

#include "../sqlite/SqliteControllerAPI.h"

class Synchronizer {
  public:
    static void sync(SqliteControllerAPI* sq);
};


#endif //SYNCHRONIZER_H
