#!/usr/bin/env bash
set -e

echo " Installing root dependencies…"
npm install

echo " Initializing DB…"
node init-db.js
if [ "$1" == "y" ]; then
  node populate-db.js
fi

echo " Installing client dependencies…"
( cd client && npm install )

echo " Starting both API and React client…"
npm run dev
