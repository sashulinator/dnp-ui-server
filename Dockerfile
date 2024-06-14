FROM nexus.inno.tech:19120/node:22.2.0-bookworm-slim

WORKDIR /app

RUN apt-get update -y && \
    apt-get install --no-install-recommends -y openssl curl && \
    rm -rf /var/lib/apt/lists/*

COPY ./package.json /app/package.json
COPY ./prisma/ /app/prisma/
COPY ./node_modules/ /app/node_modules/
COPY ./dist/ /app/dist/

CMD ["node", "dist/src/main.js"]

EXPOSE 3000
