FROM nginx:1.27-alpine

# Serve the static app directly from nginx default web root.
WORKDIR /usr/share/nginx/html

COPY index.html ./
COPY index_new.html ./
COPY timesTables.css ./
COPY timesTables.js ./
COPY imgs ./imgs
COPY sound ./sound
COPY tables ./tables
COPY _amministrazione ./_amministrazione

EXPOSE 80
