FROM node:10-alpine

RUN apk update && apk upgrade && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
      chromium@edge \
      nss@edge

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN npm install yarn -g

WORKDIR /lighthouse

ADD src /lighthouse/src
ADD test /lighthouse/test
ADD package.json /lighthouse
ADD yarn.lock /lighthouse
ADD package-lock.json /lighthouse

ADD docker/config/puppeteer.json /lighthouse/src/config/puppeteer.json

RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /lighthouse

USER pptruser

RUN cd /lighthouse && yarn

CMD ["yarn", "perf-test"]