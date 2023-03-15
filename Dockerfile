FROM node:16.13
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm install
EXPOSE 5173
ENTRYPOINT ["npm", "start"]