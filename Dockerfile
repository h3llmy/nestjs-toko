FROM node:18-alpine as builder
WORKDIR /usr/api
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:18-alpine
WORKDIR /usr/api
COPY --from=builder /usr/api/package*.json ./
COPY --from=builder /usr/api/dist ./dist
RUN npm install --omit=dev

EXPOSE 5000

CMD [ "npm", "run", "start:prod" ]