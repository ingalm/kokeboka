FROM node:15.13-alpine
WORKDIR /frontend
COPY . .
RUN npm install
RUN npm install axios
#RUN npm run build
CMD ["npm", "start"]