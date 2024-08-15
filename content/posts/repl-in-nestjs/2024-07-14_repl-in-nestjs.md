---
title: REPL in Nestjs
date: "2024-07-14"
featured: true
draft: false
description:
slug: "/blog/repl-in-nestjs/"
cover_image: "./repl.gif"
tags:
  - nestjs
  - repl
  - typescript
---

## Nestjs

NestJS stands out as a progressive framework that combines the best of TypeScript and Node.js to create an efficient and robust environment for building server-side applications. By adopting a modular architecture, it enables developers to compartmentalize their code into reusable modules, which is particularly beneficial in large-scale applications. The framework's use of decorators, inspired by Angular, makes the codebase more declarative and easier to maintain, while built-in dependency injection ensures that components and services are loosely coupled and scalable. NestJS is versatile, supporting a wide range of use cases from simple RESTful APIs to complex microservices architectures, and even real-time applications using WebSockets. Additionally, it offers seamless integration with a variety of databases through ORM libraries like TypeORM and Mongoose.

The flexibility to work with either Express or Fastify as underlying HTTP servers further enhances its adaptability. All these features make NestJS an excellent choice for developers seeking to build highly maintainable and scalable enterprise applications.

## REPL in Nestjs

The NestJS REPL (Read-Eval-Print Loop) is a powerful feature designed to improve developer productivity by allowing real-time interaction with a running NestJS application. It provides an interactive shell that can be used for debugging, testing, and inspecting the application’s components without the need for full deployment or restarting the server. Here's a deeper dive into the REPL's capabilities:

### Detailed Features of NestJS REPL:

#### 1. Real-time Application Interaction

- Access the application context and interact with components like services, controllers, and providers.
- Test service methods and modify application behavior in real time, which is ideal for experimentation and debugging.

#### 2. Dynamic Dependency Injection

- Inject and interact with services on the fly, without the need to restart the application.
- This is useful for quickly verifying logic and testing functionality.

#### 3. Improved Debugging and Troubleshooting

- Debug your application more efficiently by inspecting variables, testing functions, and analyzing component behavior live.

#### 4. Command Execution

- Execute TypeScript code snippets directly in the REPL, utilizing TypeScript's strong typing and modern JavaScript features.
- Test new code or modifications immediately without the need for redeployment.

#### 5. Access to Core Components

- Invoke methods from core components such as modules, controllers, and services directly from the REPL.
- Interact with custom logic and test endpoints live.

#### 6. Custom Scripts and Utilities

- Load and execute custom scripts, making the REPL a flexible tool for running application-specific utilities or database operations.

To get started,create a new file `repl.ts`

```ts
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

import { Logger } from "@nestjs/common";
import { repl } from "@nestjs/core";

import { AppModule } from "./app.module";

const logger = new Logger("Repl");

async function bootstrap() {
  const replServer = await repl(AppModule);

  // OPTIONAL: sets up persistent history file for repl,
  const cacheDirectory = join("node_modules", ".cache");

  if (!existsSync(cacheDirectory)) mkdirSync(cacheDirectory);

  replServer.setupHistory(
    join(cacheDirectory, ".nestjs_repl_history"),
    (error) => {
      if (error) logger.error(error);
    },
  );
}
bootstrap();
```

Then you can run the app in repl mode with :

```sh
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
