FROM node:alpine
 
WORKDIR /src
 
# COPY package*.json /app
 
# RUN npm install
 
COPY . /src
 
EXPOSE 3308
 
CMD [ "npm", "run", "start:dev" ]