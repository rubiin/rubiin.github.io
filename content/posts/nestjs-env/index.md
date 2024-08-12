---
title: How to manage environment variables on NestJS
date: '2019-09-18'
featured: false
draft: false
cover_image: './cover.png'
slug: '/blog/how-to-manage-environment-variables-on-nestjs-30ge/'
tags:
  - nodejs
  - backend
  - nestjs
---

![](https://i.imgur.com/C2C2cJW.png)

Environment variables allow us to manage the configuration of our applications separate from our codebase. Separating configurations make it easier for our application to be deployed in different environments(development,test,production).Also,large applications tend to have many environment variables.

If you are working on some project with nestjs and want to configure your app secrets and credentials in a more efficient way, you came to the right place.In this article, I would like to share initial configuration and some tip to use environment variables with <b>Nestjs</b>.

## Description

A common application level tool is `nestjs-easyconfig` which allows us to load environment variables from a file named .env[producton|dev|test].
[Nestjs-easyconfig](https://github.com/rubiin/nestjs-easyconfig) loads configs from your `.env` (Wraps dotenv module) ⚙️ 🔥

## Installation

```bash
$ npm install nestjs-easyconfig
$ yarn add nestjs-easyconfig
```

## Usage

### With config file supplied (basic):

```javascript
import { Module } from '@nestjs/common';
import { EasyconfigModule } from 'nestjs-easyconfig';

@Module({
  imports: [EasyconfigModule.register({ path: './config/.env' })],
})
export class AppModule {}
```

### With config file supplied and safe set to true:

```javascript
import { Module } from '@nestjs/common';
import { EasyconfigModule } from 'nestjs-easyconfig';

@Module({
  imports: [EasyconfigModule.register({ path: './config/.env', safe: true })],
})
export class AppModule {}
```

By default safe is set to false. When safe is set to `true`, the module compares the supplied env
file with the sample env file to find missing keys. If any keys which are in .env.sample but not in the environment used, it is immediately reported in console.

`Note`: To use this, a sample env file `.env.sample` should be placed in the root dir

### Without config file supplied:

```javascript
import { Module } from '@nestjs/common';
import { EasyconfigModule } from 'nestjs-easyconfig';

@Module({
  imports: [EasyconfigModule.register({})],
})
export class AppModule {}
```

In this case, you have to pass in the <b>NODE_ENV</b> value and the `.env` file to read will be determined accordingly.
Loads environment variables from `.env.[development|test|production][.local]` files
For example, <b>NODE_ENV=dev</b> will make the app read `.env.dev`

> Note: The .env file also has to be in root folder
