#!/bin/bash
imageName=image-generator
containerName=image-generator

# cp ../setup/.env.staging ./.env.staging

docker build -t $imageName  . -f ./staging.Dockerfile

# echo Delete old container...
# sudo docker rm -f $containerName

# echo Run new container...
# sudo docker run -d -p 2229:1337 --name $containerName --restart unless-stopped $imageName
docker compose up -d --force-recreate --build --scale $imageName=1
# docker-compose up -d --scale transaction-credit-servicer=1

