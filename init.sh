#!/bin/bash

npm install
node init-db.js
if [ "$1" == "y" ]; then
    node populate-db.js
fi
cd client || exit
npm install
cd ..
npm run dev
