---
title: Docker pipeline with Typescript + Express for production
date: 2022-06-08
featured: false
draft: false
slug: '/blog/docker-pipeline-express/'
description:
cover_image: https://miro.medium.com/max/9986/1*hohK6EONXCAy4mTRkT8K8A.png
tags:
  - typescript
  - docker
  - express
---

This post will guide you through how to setup docker for a express app on typescript. This also works for other frameworks besides express.
This post assumes you have used docker.
We will be using multi stage builds on docker as we have to
compile the express app before we can actually use it on production. For reference on multistage build, check it on here
https://docs.docker.com/develop/develop-images/multistage-build/

In a nutshell, as the name suggest multistage build is nothing more than a docker file split into several stages , each stage creating an intermediate image and passing the result to the next step and so on. The main difference using multi stage build vs using single build for compiling and running an app is the final image size.

```dockerfile
## this is the stage one , also know as the build step

FROM node:12.17.0-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build

## this is stage two , where the app actually runs

FROM node:12.17.0-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY --from=0 /usr/src/app/dist ./dist
EXPOSE 3000
CMD npm start

```

This is the dockerfile we will be using for building and running the app. Here we have defined two stages, one for compilation and another stage is for actually running the app.
The first stage code is nothing different from a typical nodejs dockerfile, the only difference is we are building or compiling the app with `npm run build ` .Now emphasis on the second stage.
The important lines here are, we are only installing dependencies for production and also copying dist. The copy command here tells docker to copy the dist files from the build step on to the deployment stage.Then we are exposing the port like we usually do and atlast, running the npm command for starting the app.

The full project can be found at:
https://github.com/rubiin/dockerpipeline-with-typescript-express
