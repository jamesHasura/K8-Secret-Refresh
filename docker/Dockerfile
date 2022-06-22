FROM node
WORKDIR /usr/app
RUN npm init -y
RUN npm install axios 
RUN npm install node-schedule 
RUN npm install @kubernetes/client-node
COPY ./refresh-credentials.js /usr/app/refresh-credentials.js
RUN chmod +x /usr/app/refresh-credentials.js
ENV TOKEN_REFRESH_ENDPOINT= // JPMC TO EDIT 
ENV TOKEN_REFRESH_PERIOD="* */25 * * * * " // JPMC TO EDIT 
CMD [ "node", "refresh-credentials.js"]
EXPOSE 8080
