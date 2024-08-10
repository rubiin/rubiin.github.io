---
title: Add custom operators to typeorm
date: 2019-02-12
featured: true
draft: false
slug: '/blog/add-custom-operators-to-typeorm/'
cover_image: https://raw.githubusercontent.com/typeorm/typeorm/master/resources/logo_big.png
tags:
  - nodejs
  - typescript
---

TypeORM is an ORM that can run in NodeJS, Browser, Cordova, PhoneGap, Ionic, React Native, NativeScript, Expo, and Electron platforms and can be used with TypeScript and JavaScript (ES5, ES6, ES7, ES8). Its goal is to always support the latest JavaScript features and provide additional features that help you to develop any kind of application that uses databases - from small applications with a few tables to large scale enterprise applications with multiple databases.

TypeORM supports both Active Record and Data Mapper patterns, unlike all other JavaScript ORMs currently in existence, which means you can write high quality, loosely coupled, scalable, maintainable applications the most productive way.

TypeORM is highly influenced by other ORMs, such as Hibernate, Doctrine and Entity Framework.

While the framework gives you many features out of the box, it also gives you the ability to make custom operators which it might be lacking for repository . One of the operators that I use but didn't find in typeorm was ILike operator. For those who don't know what ILike operator doesn in sql is the same thing as Like operator but is case insensitive.

To make a new operator in typeorm for repository pattern is pretty straight forward,

```ts
import { Connection, FindOperator, FindOperatorType } from 'typeorm';

class FindOperatorWithExtras<T> extends FindOperator<T> {
  constructor(
    type: FindOperatorType | 'ilike',
    value: FindOperator<T> | T,
    useParameter?: boolean,
    multipleParameters?: boolean,
  ) {
    // @ts-ignore
    super(type, value, useParameter, multipleParameters);
  }

  public toSql(connection: Connection, aliasPath: string, parameters: string[]): string {
    // @ts-ignore
    if (this._type === 'ilike') {
      return `${aliasPath} ILIKE ${parameters[0]}`;
    }

    return super.toSql(connection, aliasPath, parameters);
  }
}

/**
 * Find Options Operator.
 * Example: { someField: Like("%some string%") }
 */
export function ILike<T>(value: T | FindOperator<T>): FindOperatorWithExtras<T> {
  return new FindOperatorWithExtras('ilike', value);
}
```

In the example above, we are making ILike operator which is not available in typeorm by default.
