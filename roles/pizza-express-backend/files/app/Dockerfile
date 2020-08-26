# use required node version
FROM node:8.4.0
WORKDIR /usr/src/app
# redundant files are excluded by .dockerignore
COPY . .
RUN npm init -y && npm install
EXPOSE 3000:8081
CMD [ "node", "server.js" ]
