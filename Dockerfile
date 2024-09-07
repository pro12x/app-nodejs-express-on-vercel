FROM node:20
WORKDIR /app
LABEL maintainer="Franchis Janel MOKOMBA"
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]