FROM node:18-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node:node package*.json ./
COPY yarn.lock ./

RUN yarn

COPY --chown=node:node . .
COPY .env.production .env

RUN yarn prisma:generate

RUN yarn build

ENV NODE_ENV production

EXPOSE 5000
CMD [ "node", "dist/index.js" ]
USER node