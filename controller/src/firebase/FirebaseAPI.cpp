#include <Poco/Exception.h>
#include <Poco/JSON/Object.h>
#include <Poco/JSON/Parser.h>
#include <Poco/Net/HTTPSClientSession.h>
#include <Poco/Net/HTTPMessage.h>
#include <Poco/Net/HTTPRequest.h>
#include <Poco/Net/HTTPResponse.h>
#include <Poco/Path.h>
#include <Poco/URI.h>

#include <iostream>
#include <ctime>
#include <string>
#include <future>

#include "FirebaseAPI.h"
#include "FirebaseHelper.h"

using namespace Poco;
using namespace Poco::Net;

int FirebaseAPI::httpPOST(const std::string url, const Poco::JSON::Object::Ptr obj) {
    Poco::URI uri(url);
    std::string path(uri.getPathAndQuery());
    if (path.empty()) path = "/";

    HTTPSClientSession session(uri.getHost(), uri.getPort());
    HTTPRequest request(HTTPRequest::HTTP_POST, path, HTTPMessage::HTTP_1_1);
    HTTPResponse response;

    request.setContentType("application/json");
    std::stringstream ss;
    obj -> stringify(ss);
    request.setContentLength(ss.str().size());
    std::ostream& o = session.sendRequest(request);

    obj -> stringify(o);

    // get the actual response
    std::istream& s = session.receiveResponse(response);

    Poco::JSON::Parser parser;
    Poco::Dynamic::Var parsed = parser.parse(s);
    std::cout << parsed.toString() << std::endl;

    return response.getStatus();
}

int FirebaseAPI::runQuery(const std::string buildingId) {
    Poco::JSON::Object::Ptr obj = FirebaseHelper::buildStructuredQuery(buildingId);
    std::string url("https://firestore.googleapis.com/v1beta1/projects/humidity-monitoring-system/databases/(default)/documents:runQuery");
    return httpPOST(url, obj);
}

int FirebaseAPI::createDocument(const Poco::JSON::Object::Ptr obj) {
    std::string url("https://firestore.googleapis.com/v1beta1/projects/humidity-monitoring-system/databases/(default)/documents/measurements");
    return httpPOST(url, obj);
}
