---
title: Typeof and lookup type in typescript
date: 2022-05-02
description:
featured: false
draft: false
slug: "/blog/typeof-and-lookup-type-in-typescript/"
cover_image: "../unknown-type-in-ts/cover.png"
tags:
  - typescript
  - types
---

## Overview

In TypeScript, the typeof operator is used to obtain the type of a variable or property at compile time. It can be employed to create type aliases based on existing values or objects, ensuring type consistency. For example, if you have a variable const user = { name: 'Alice', age: 25 };, using typeof user will create a type that matches the shape of the user object, helping to enforce that other variables conform to the same structure.

Lookup types, or indexed access types, allow you to access the type of a specific property within an object type. By using the syntax Type[Key], where Type is an object type and Key is a property name, you can extract the type of a specific property. For instance, if you have a type Person with a property age, Person['age'] will yield the type of the age property. This feature is useful for creating more dynamic and flexible types based on the structure of existing types.

## Typeof in typescript

```js
const user = {
  name: "Rubin",
  age: 15,
  address: "Kathmandu"
}

type UserType = typeof user  //  {name: string,age:number,address: string}
```

## Lookup type in typescript

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

## Conclusion

In TypeScript, typeof and lookup types enhance type safety and flexibility. The typeof operator allows you to create types based on existing values, ensuring consistency and reducing errors. Lookup types enable you to access and use the type of specific properties within an object, providing a way to build dynamic and reusable type definitions. Together, these features help streamline type management and improve code reliability by leveraging TypeScript's strong typing capabilities.
