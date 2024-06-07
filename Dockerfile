FROM nexus.inno.tech:19120/node:22.2.0-bookworm-slim

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./node_modules/ /app/node_modules/
COPY ./dist/ /app/dist/

CMD ["yarn", "start:prod"]
