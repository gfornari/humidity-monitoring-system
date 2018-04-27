#include "Poco/Data/Session.h"
#include "Poco/Data/SQLite/Connector.h"
#include <vector>
#include <iostream>

#include "SqliteControllerAPI.h"

using namespace Poco::Data;

SqliteControllerAPI::SqliteControllerAPI(){
    // register SQLite connector
    Poco::Data::SQLite::Connector::registerConnector();

    // create a session
    session = new Session("SQLite","hts.db");
}

int  SqliteControllerAPI::createDataTable()
{
    // (re)create table
    *session << "CREATE TABLE IF NOT EXISTS sensor (buldingId VARCHAR(30), temperature INTEGER(30),  humidity INTEGER(30), sensorId VARCHAR(30), timestamp datetime)", Keywords::now;

    return 0;
}

int SqliteControllerAPI::insert(Measure data)
{
    Statement insert(*session);
    insert << "INSERT INTO sensor VALUES(?, ?, ?, ?, ?)",
        Keywords::use(data.buildingId),
        Keywords::use(data.temperature),
        Keywords::use(data.humidity),
        Keywords::use(data.sensorId),
        Keywords::use(data.timestamp);

    insert.execute();

    Statement retrivelast(*session);
    retrivelast << "SELECT last_insert_rowid()";

    int last_insert_id = retrivelast.execute();

    return last_insert_id;
}

void SqliteControllerAPI::deleterow(int rowid)
{
    Statement deleterow(*session);
    deleterow << "DELETE FROM sensor WHERE rowid = " << rowid;

    deleterow.execute();
}

Statement SqliteControllerAPI::select(Measure& data, std::string query)
{
    Statement select(*session);

    select << query,
        Keywords::into(data.rowid),
        Keywords::into(data.buildingId),
        Keywords::into(data.temperature),
        Keywords::into(data.humidity),
        Keywords::into(data.sensorId),
        Keywords::into(data.timestamp),
        Keywords::range(0, 1); //  iterate over result set one row at a time

    // Usage:
    // while (!select.done()) {
    //     select.execute();
    //     std::cout << data.buildingId << " " << data.temperature << " " << data.humidity << " " << data.sensorId << " " << data.timestamp << std::endl;
    // }

    return select;
}

Statement SqliteControllerAPI::selectAll(Measure& data)
{
    return select(data, "SELECT rowid, * FROM sensor");
}


