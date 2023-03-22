FROM nginx:latest

RUN apt-get update && apt-get install vim -y
                                                                                                  
COPY oauth2.js /etc/nginx/conf.d/oauth2.js
COPY nginx.conf /etc/nginx/nginx.conf
COPY oauth2.conf /etc/nginx/sites-enabled/oauth2.conf
ADD ./build /usr/share/nginx/html/build

EXPOSE 80
