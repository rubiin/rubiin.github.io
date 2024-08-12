---
title: typeof and lookup type in typescript
date: 2022-05-02
description:
featured: false
draft: false
slug: '/blog/typeof-and-lookup-type-in-typescript/'
cover_image: "../unknown-type-in-ts/cover.png"
tags:
  - typescript
  - types
---

- The `typeof` key can be used to extract type from an existing data

```js
const user = {
  name: "Rubin",
  age: 15,
  address: "Kathmandu"
}

type UserType = typeof user  //  {name: string,age:number,address: string}
```

- Look up types on the other hand are used to extract a portion from a complex type and create a new type

```js
type requestType = {

  payload: {
    name: string,
    user: number,
    roles: {
      edit: boolean,
      create: boolean,
      read: boolean
    }
  },
   params: {
     id: number,
     type: string
   }
}

// if we want to use type of  params as a type then

type Params = requestType["params"]  //  {id: number,type: string }
type Roles = requestType["payload"]["roles"] //   roles: {edit: boolean,create: boolean,read: boolean}

```
