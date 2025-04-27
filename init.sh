#!/usr/bin/env bash
set -e

echo " Installing root dependencies"
npm install

echo " Initializing DB"
if [ "$1" == "y" ]; then
  node init-db.js
  node populate-db.js
fi

echo " Installing client dependencies"
cd client || exit
npm install
cd ..

echo " Starting both API and React client"
npm run dev
