ARG NODE_IMAGE=node:16.13.1-alpine

FROM $NODE_IMAGE AS base
RUN apk --no-cache add dumb-init
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node
RUN mkdir tmp

FROM base AS developement
COPY --chown=node:node ./package*.json ./
RUN yarn install
COPY --chown=node:node . .
EXPOSE 3333
CMD ["yarn", "dev" ]