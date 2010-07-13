@echo off

echo Creating build dir
IF NOT EXIST build MKDIR build

echo Creating minified script
java -jar yuicompressor\build\yuicompressor-2.4.2.jar -o build/jsuri-min.js jsuri.js

echo Copying original source
copy jsuri.js build\jsuri.js