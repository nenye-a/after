FROM node:20.17

WORKDIR /app

COPY . ./
RUN yarn
RUN yarn compile

EXPOSE 4000
CMD ["node", "dist/index.js"]


