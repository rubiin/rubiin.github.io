---
title: Resolving path alias in nestjs projects
date: '2019-09-02'
featured: false
draft: false
slug: '/blog/resolving-path-alias-in-nestjs-projects/'
description:
cover_image: './cover.png'
tags:
  - typescript
  - nodejs
  - nestjs
---

Building a nestjs project in typescript is really awesome but as the project starts to grow , your directories will grow too thus making your imports lengthy like this:

```javascript
import { User } from '../../user/model';
import { Article } from '../../article/model';

import { Cache } from '../../../../cache';
import { MongoDB } from '../../../../mongodb';
```

# Path mapping to the rescue!

TypeScript allows the use of path mapping which allows arbitrary module paths (that doesn’t start with “/” or “.”) to be specified and mapped to physical paths in the filesystem in the compiler options in tsconfig file like below:

```json
{
  "compilerOptions": {
    ...
    "baseUrl": "./src",
    "paths": {
      "@datorama/utils/*": ["app/utils/*"],
      "@datorama/pipes/*": ["app/pipes/*"]
    }
    ...
  }
}
```

The first property that we must add is the baseUrl property. Notice that paths are resolved relative to baseUrl .
The second property is the paths property. This tells the compiler for any module import that matches the pattern "@datorama/utils/\*" , to look in the following location:

# The Problem

When you run the code inline (during execution) , it works as intended but when you build it for production and try to run it, you get the following error:

```
Error: Cannot find module '@datorama/utils'
```

The issue mentioned is of execution with node.Actually the problem occurs when executing the built files with node dist/main.js, not during the build process with tsc.

# The Solution

After doing some search on the problem, I came across multiple solutions.

- [Using webpack](https://github.com/dividab/tsconfig-paths-webpack-plugin)
- [Using Module Aliases package](https://medium.com/@caludio/how-to-use-module-path-aliases-in-visual-studio-typescript-and-javascript-e7851df8eeaa)
- Bootstrapping tsc with explicit params

Although there are bunch of solutions above, the first and second one didn't work for me. So I went with the third one which was actually mentioned in the docs of [tsconfig-paths](https://github.com/dividab/tsconfig-paths) which nest uses to resolve these paths at runtime.

To apply the solution, make a file named tsconfig-paths-bootstrap.js (The name is up to you) and copy/paste the below snippet

```javascript
// tsconfig-paths-bootstrap.js

const tsConfig = require('./tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');

const baseUrl = './dist'; // Either absolute or relative path. If relative it's resolved to current working directory.
tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths,
});
```

Build the dist file normally as you do with tsc. After that, you can run it with

```sh
node -r ./tsconfig-paths-bootstrap.js dist/main.js
```

> Note: Check the file name with the filename in the command and you are good to go

Shoutout to [Jay McDoniel](https://github.com/jmcdo29) for his help.
