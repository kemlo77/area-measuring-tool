#!/bin/bash
sudo docker run\
 -d\
 --rm\
 --name sonarqube\
 -p 9000:9000\
 sonarqube:7.5-community

# this will start a docker container with SonarQube locally
# anv: admin
# pwd: admin
# acces it on localhost:9000

# https://blog.setapp.pl/sonarqube_introduction
