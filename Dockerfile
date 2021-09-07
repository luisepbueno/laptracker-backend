FROM node:14

WORKDIR /laptracker
COPY package* ./
RUN npm install

COPY . .

EXPOSE 8000

CMD [ "node", "app.js" ]
