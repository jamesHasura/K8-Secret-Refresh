FROM node
WORKDIR /usr/app
RUN npm init -y
RUN npm install axios 
RUN npm install node-schedule 
RUN npm install @kubernetes/client-node@^16.0.1
RUN npm install dotenv
COPY ./refresh-credentials.js /usr/app/refresh-credentials.js
RUN chmod +x /usr/app/refresh-credentials.js
ENV TOKEN_REFRESH_ENDPOINT= // EDIT THIS FIELD 
ENV TOKEN_REFRESH_PERIOD="* */25 * * * * " // EDIT THIS FIELD 
CMD [ "node", "refresh-credentials.js"]
EXPOSE 8080
