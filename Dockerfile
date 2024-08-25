FROM node:20.13.1-alpine AS builder
WORKDIR /usr/api
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:20.13.1-alpine
WORKDIR /usr/api
COPY --from=builder /usr/api/package*.json ./
RUN npm install --omit=dev --ignore-scripts
COPY --from=builder /usr/api/dist ./dist

EXPOSE ${PORT}

CMD [ "npm", "run", "start:prod" ]