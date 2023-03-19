FROM node:18.13-alpine3.16 AS builder
WORKDIR /app
COPY . .
RUN yarn
ENV PUBLIC_URL /voc
RUN yarn build

FROM node:18.13-alpine3.16 AS production
WORKDIR /app
COPY --from=builder /app/index.js ./index.js
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/build ./build
RUN rm -r /app/build/appConfig.js
EXPOSE 5000
CMD ["yarn", "serve"]