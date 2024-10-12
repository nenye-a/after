FROM --platform=linux/amd64 node:20.17

WORKDIR /usr/src/app

COPY . ./
RUN yarn
RUN yarn compile

EXPOSE 4000
CMD ["node", "dist/index.js"]


