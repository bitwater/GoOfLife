FROM node:0.12

# This Dockerfile doesn't build the application. It only runs it. Use
# "grunt dist" before building the image.

COPY package.json server.js /usr/src/app/
COPY dist /usr/src/app/dist/
WORKDIR /usr/src/app
RUN npm install --production && npm cache clear

EXPOSE 5000

USER daemon
CMD [ "npm", "start" ]
