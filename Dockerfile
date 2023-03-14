FROM node:18.13
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build
EXPOSE 5173
CMD npm start