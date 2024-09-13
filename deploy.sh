#!/bin/bash

git pull
sed -i -e 's/http:\/\/localhost:8090/https:\/\/sdbrother.org\/api/g' /home/sd/pet/ui-ng-ant/src/environments/environment.ts
npm install
ng build --c=production ui-ng-ant
rm -r /var/www/html/*
cp -r /home/sd/pet/ui-ng-ant/dist/ui-ng-ant/browser/* /var/www/html/
mv /var/www/html/index.csr.html /var/www/html/index.html
