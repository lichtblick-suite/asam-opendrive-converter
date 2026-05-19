cmake_minimum_required(VERSION 3.14)
project(libOpenDRIVE_WASM)

# Build libOpenDRIVE as a WASM module using Emscripten
# Usage:
#   mkdir build-wasm && cd build-wasm
#   emcmake cmake -DCMAKE_BUILD_TYPE=Release ..
#   emmake make -j$(nproc)

set(LIB_DIR ${CMAKE_CURRENT_SOURCE_DIR}/submodule/libOpenDRIVE)

# Add Embind source to the library sources
set(SOURCES
    ${LIB_DIR}/src/Geometries/Arc.cpp
    ${LIB_DIR}/src/Geometries/CubicSpline.cpp
    ${LIB_DIR}/src/Geometries/Line.cpp
    ${LIB_DIR}/src/Geometries/ParamPoly3.cpp
    ${LIB_DIR}/src/Geometries/RoadGeometry.cpp
    ${LIB_DIR}/src/Geometries/Spiral.cpp
    ${LIB_DIR}/src/Geometries/Spiral/odrSpiral.cpp
    ${LIB_DIR}/src/Junction.cpp
    ${LIB_DIR}/src/Lane.cpp
    ${LIB_DIR}/src/LaneSection.cpp
    ${LIB_DIR}/src/Mesh.cpp
    ${LIB_DIR}/src/OpenDriveMap.cpp
    ${LIB_DIR}/src/RefLine.cpp
    ${LIB_DIR}/src/Road.cpp
    ${LIB_DIR}/src/RoadMark.cpp
    ${LIB_DIR}/src/RoadNetworkMesh.cpp
    ${LIB_DIR}/src/RoadObject.cpp
    ${LIB_DIR}/src/RoadSignal.cpp
    ${LIB_DIR}/src/RoutingGraph.cpp
    ${LIB_DIR}/src/Embind.cpp
)

# Fetch pugixml dependency
include(FetchContent)
FetchContent_Declare(
    pugixml
    GIT_REPOSITORY https://github.com/zeux/pugixml.git
    GIT_TAG v1.14
)
FetchContent_MakeAvailable(pugixml)

# Build as a JS/WASM module (not executable)
add_executable(libOpenDRIVE ${SOURCES})

target_include_directories(libOpenDRIVE PRIVATE
    ${LIB_DIR}/include
    ${LIB_DIR}/include/Geometries
)

target_link_libraries(libOpenDRIVE PRIVATE pugixml)

target_compile_features(libOpenDRIVE PRIVATE cxx_std_17)

# Emscripten-specific flags
if(EMSCRIPTEN)
    set_target_properties(libOpenDRIVE PROPERTIES
        OUTPUT_NAME "libOpenDRIVE"
        SUFFIX ".js"
    )

    target_link_options(libOpenDRIVE PRIVATE
        # Embind support
        --bind
        # Allow memory growth (maps can be large)
        -sALLOW_MEMORY_GROWTH=1
        # Export as ES module for bundler compatibility
        -sEXPORT_ES6=1
        -sMODULARIZE=1
        -sEXPORT_NAME=createLibOpenDRIVE
        # Enable filesystem for writing XML to virtual /tmp
        -sFILESYSTEM=1
        # Optimization
        -O2
        # No exception catching for smaller bundle
        -sDISABLE_EXCEPTION_CATCHING=1
        # Environment: web, worker, and node (node needed for tests)
        -sENVIRONMENT=web,worker,node
        # Single file: embed WASM in JS for easier bundling
        -sSINGLE_FILE=0
    )
else()
    message(FATAL_ERROR "This CMakeLists.txt is for Emscripten WASM builds only. Use: emcmake cmake .")
endif()
