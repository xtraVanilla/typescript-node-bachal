#!/bin/bash

distPath="./dist/views"
if [ ! -d $distPath ]; then
    mkdir $distPath
fi

tsc
npm run copy-files
