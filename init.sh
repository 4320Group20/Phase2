#!/bin/bash

npm install
cd client || exit
npm install
cd ..
npm run dev
