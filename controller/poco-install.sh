#!/bin/bash

set -e

wget https://pocoproject.org/releases/poco-1.8.1/poco-1.8.1-all.tar.gz

# part of the poco documentation
# see https://pocoproject.org/docs/00200-GettingStarted.html
gunzip poco-1.8.1-all.tar.gz
tar -xf poco-1.8.1-all.tar
cd poco-1.8.1-all
./configure --omit=Data/ODBC,Data/MySQL,MongoDB,PDF,CppParser,PageCompiler,Zip
make -s -j$(nproc)
sudo make -s install

# create the necessary links and cache to the most recent shared libraries found
# in the directories specified on the command line, in the file /etc/ld.so.conf
sudo ldconfig
