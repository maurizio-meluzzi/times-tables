FROM nginx:1.27-alpine

# Serve the static app directly from nginx default web root.
WORKDIR /usr/share/nginx/html

COPY public/ ./

EXPOSE 80
