FROM node:7.7-alpine

MAINTAINER sudokrew/devops

ADD . /app

WORKDIR /app

EXPOSE 8080

CMD ["npm", "start"]
