---
title: Getting started with minio on nestjs
published: true
description:
tags: nestjs,minio,backend,javascript
---

## Description

MinIO is an object storage server released under Apache License v2.0. It is compatible with Amazon S3 cloud storage service. It is best suited for storing unstructured data such as photos, videos, log files, backups and container / VM images. Size of an object can range from a few KBs to a maximum of 5TB.

MinIO server is light enough to be bundled with the application stack, similar to NodeJS, Redis and MySQL.

This's a [nest-minio](https://github.com/rubiin/nest-minio) module for [Nest](https://github.com/nestjs/nest). This quickstart guide will show you how to install the client SDK and execute an example JavaScript program. For a complete list of APIs and examples, please take a look at the [JavaScript Client API Reference](https://docs.min.io/docs/javascript-client-api-reference) documentation.

This document assumes that you have a working [nodejs](http://nodejs.org/) setup in place.

## Installation

```bash
$ npm i --save nest-minio
```

## Download from NPM

```sh
npm install --save nest-minio
```

## Initialize MinIO Client

You need five items in order to connect to MinIO object storage server.

| Params    | Description                                                                                         |
| :-------- | :-------------------------------------------------------------------------------------------------- |
| endPoint  | URL to object storage service.                                                                      |
| port      | TCP/IP port number. This input is optional. Default value set to `80` for HTTP and `443` for HTTPs. |
| accessKey | Access key is like user ID that uniquely identifies your account.                                   |
| secretKey | Secret key is the password to your account.                                                         |
| useSSL    | Set this value to 'true' to enable secure (HTTPS) access                                            |

Provide the credentials for minio module by importing it as :

```javascript
import { Module } from '@nestjs/common';
import { NestMinioClientController } from './nest-minio-client.controller';
import { NestMinioModule } from '../nest-minio.module';

@Module({
  controllers: [NestMinioClientController],
  imports: [
    NestMinioModule.register({
      endPoint: 'play.min.io',
      port: 9000,
      useSSL: true,
      accessKey: 'Q3AM3UQ867SPQQA43P2F',
      secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG',
    }),
  ],
})
export class NestMinioClientModule {}

});
```

Then you can use it in the controller or service by injecting it in the controller as:

```javascript

 constructor(@Inject(MINIO_CONNECTION) private readonly minioClient) {}

```

## Quick Start Example - File Uploader

This example program connects to an object storage server, makes a bucket on the server and then uploads a file to the bucket.

We will use the MinIO server running at https://play.min.io in this example. Feel free to use this service for testing and development. Access credentials shown in this example are open to the public.

```js

import { Controller, Get, Inject } from '@nestjs/common';
import { MINIO_CONNECTION } from '../constants';

@Controller()
export class NestMinioClientController {
  constructor(@Inject(MINIO_CONNECTION) private readonly minioClient) {}

  @Get()
  index() {
    const file = '/tmp/app.zip';

    const metaData = {
      'Content-Type': 'application/octet-stream',
      'X-Amz-Meta-Testing': 1234,
      example: 5678,
    };
    // Using fPutObject API upload your file to the bucket europetrip.
    this.minioClient.fPutObject(
      'europetripxxx3',
      'app.zip',
      file,
      metaData,
      function(err, etag) {
        if (err) {
          return console.log(err);
        }
        console.log('File uploaded successfully.');
      },
    );
  }
}


```
