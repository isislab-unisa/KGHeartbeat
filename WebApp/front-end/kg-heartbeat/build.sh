!/bin/bash

npm run build

rm -r /var/www/kgheartbeat
mv build/ /var/www/
mv /var/www/build /var/www/kgheartbeat
service apache2 restart