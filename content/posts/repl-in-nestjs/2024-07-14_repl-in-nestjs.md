---
title: REPL in Nestjs
date: '2024-07-14'
featured: false
draft: false
description:
slug: '/blog/repl-in-nestjs/'
cover_image: https://docs.nestjs.com/assets/repl.gif
tags:
  - nestjs
  - nodejs
  - repl
  - typescript
---

One of the features of Nestjs is Tte REPL (Read-Eval-Print Loop) mode, a powerful tool that allows you to interactively test and execute code within the context of your NestJS application. This is particularly useful for quick experimentation, testing services, or debugging from the terminal. Here’s a step-by-step guide on how to use the REPL mode in NestJS:

create a new file `repl.ts`
```ts
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

import { Logger } from "@nestjs/common";
import { repl } from "@nestjs/core";

import { AppModule } from "./app.module";

const logger = new Logger("Repl");

async function bootstrap() {
  const replServer = await repl(AppModule);

  // OPTIONAL: sets up persistant history file for repl,
  const cacheDirectory = join("node_modules", ".cache");

  if (!existsSync(cacheDirectory))
    mkdirSync(cacheDirectory);

  replServer.setupHistory(
    join(cacheDirectory, ".nestjs_repl_history"),
    (error) => {
      if (error)
        logger.error(error);
    },
  );
}
bootstrap();

```

Then you can run the app in repl mode with :

``` sh
npm run start -- --entryFile repl
```
Even better, add a script on your `package.json`

```json
"start:repl":"npm run start -- --entryFile repl"
```

It will initiate an interactive server, from which you can easily access your nest app methods by getting them either as
```sh
get(AppService).getAllPosts()
```

or

```sh
$(AppService).getAllPosts()
```
You can also navigate with the command history with ↕️ arrow keys

Read more at the [official documentation](https://docs.nestjs.com/recipes/repl)

