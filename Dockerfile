FROM node
COPY package.json package.json
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "node", "build/index.js" ]