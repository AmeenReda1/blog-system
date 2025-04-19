FROM node:22 as builder


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install 

COPY . .

RUN yarn build

FROM node:22-slim as production

ENV NODE_ENV production
USER node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install --production

COPY --from=builder /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]