CXX := g++
CXXFLAGS := -Wall -std=c++11 -pthread

TARGET_EXEC ?= a.out

BUILD_DIR ?= ./build
SRC_DIRS ?= ./src

SRCS := $(shell find $(SRC_DIRS) -name *.cpp -or -name *.c -or -name *.s)
OBJS := $(SRCS:%=$(BUILD_DIR)/%.o)
DEPS := $(OBJS:.o=.d)

INC_DIRS := $(shell find $(SRC_DIRS) -type d)
INC_FLAGS := $(addprefix -I,$(INC_DIRS),/usr/local/include/Poco)

CPPFLAGS ?= $(INC_FLAGS) -MMD -MP

LIBDIR := /usr/local/lib
LDFLAGS := -lPocoFoundation -lPocoNet -lPocoJSON -lPocoNetSSL -lPocoData -lPocoDataSQLite -lwiringPi -lwiringPiDev -lpthread -lm -lcrypt -lrt

$(BUILD_DIR)/$(TARGET_EXEC): $(OBJS)
	$(CXX) $(CXXFLAGS) $(OBJS) -o $@ -L$(LIBDIR) $(LDFLAGS)

# c++ source
$(BUILD_DIR)/%.cpp.o: %.cpp
	$(MKDIR_P) $(dir $@)
	$(CXX) $(CPPFLAGS) $(CXXFLAGS) -c $< -o $@

.PHONY: clean

clean:
	$(RM) -r $(BUILD_DIR)

-include $(DEPS)

MKDIR_P ?= mkdir -p
