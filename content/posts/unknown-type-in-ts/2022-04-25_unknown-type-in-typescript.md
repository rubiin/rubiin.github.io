---
title: Unknown type in typescript
date: 2022-04-25
featured: false
draft: false
slug: '/blog/unknown-type-in-typescript/'
description:
cover_image: './cover.png'
tags:
  - typescript
  - types
  - javascript
---

The `unknown` type in typescript is a common type that you will likely to come across. It is a strict version of the
`any` type and interms of accepting data, it accepts any data type which is similar to nature of `any` type. However
there is a minor differences between them. Since an `unknown` type also can have multiple type, it forces to use type assertion before using the types function. To further clear , lets look an example

```js
 function readAny(val: any){
     return val.trim();
}
```

In the above example, we are using `any` type for the value. Since trim is a string function, this works well for string data. However on supplying numbers or booleans , we get a runtine error

The same example using `unknown`

```js
 function readAny(val: unknown){
     return val.trim(); // typescript error at this line
}
```

Typescript would throw a compile time error as we are using string function without type assertion. To fix it, the correct code would look like

```js
 function readAny(val: unknown){

    if( typeof val === 'string')
     return val.trim();
}
```
