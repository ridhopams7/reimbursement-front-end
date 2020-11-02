FROM telkomindonesia/alpine:nodejs-8.9.3 as builder
LABEL maintainer="Dimas Restu Hidayanto <dimas@playcourt.id>"

# Parse argument for build step
ARG ARGS_NODE_BUILD


# Set Working Directory Under Repository Directory
WORKDIR /usr/src/app

# Update Some Package
RUN apk add --update --no-cache --virtual .build-dev build-base python python-dev

# Copy all file inside repository to Working Directory
COPY . .

# install required package 
#   If your apps having bycypt please add this command before "&& apl del .build-dev"
#   > && npm rebuild bcrypt --build-from-source
RUN npm i -g npm \
    && npm i -g node-gyp \
    && npm i \
    && npm run build:${ARGS_NODE_BUILD} \ 
    && apk del .build-dev

FROM telkomindonesia/alpine:nginx-1.12.2-novol

COPY --from=builder /usr/src/app/build/ /var/www/data/html

EXPOSE 8080
