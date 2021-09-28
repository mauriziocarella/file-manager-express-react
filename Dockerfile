FROM node:15

WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .

WORKDIR /app/www
COPY ["www/package.json", "www/package-lock.json*", "./"]
RUN npm install --verbose
COPY ["www/", "./"]

WORKDIR /app
RUN npm run build
CMD ["npm", "run", "start"]
