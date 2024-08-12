---
title: Typescript notes
date: 2022-05-07
featured: true
draft: false
slug: '/blog/typescript-notes/'
description:
cover_image: '../unknown-type-in-ts/cover.png'
tags:
  - typescript
---

- unknown type functions like any but does not allow the data method to be called
  Typescript would throw a compile time error as we are using string function without type assertion. To fix it, the correct code would look like

```js
function readAny(val: unknown){

   if( typeof val === 'string')
    return val.trim();
}
```

- to check null/undefined use, ==
  eg.

```js
if(value == null) // check for both null and undefined
```

- intersection types (&) behaves like inheritance in classes meaning the attributes of one type is inherited by another type without causing duplication

* example:

```js
type Point2d = {
  x: number;
  y:number;
}

type Point3d = Point2d & {
  z:number;
}

const p1: Point2d = {x: 1, y:2}
const p2: Point3d = {x: 1, y:2, z: 9}

```

point 3D has all the members of point 2D plus member z. All members in intersection types are required. Not passing "z" on Point3D type will cause error

- Union type is defined by pipe operator "|". It means the type can either be the single types or their combination. All property of combination are optional

```js
interface A {
  a1: string,
  a2: string,
}

interface B {
  b1: string,
  b2: string;
}

type UnionAB = A | B;


const unionAB1: UnionAB = {
  a1: 'xxx',
  a2: 'xxx',
  b1: 'xxx',
  b2: 'xxx',
};

const unionAB2: UnionAB = {
  a1: 'xxx',
  a2: 'xxx',
};

const unionAB3: UnionAB = {
  b1: 'xxx',
  b2: 'xxx',
};

// Error
// Property 'a1' does not exist on type 'B'.
console.log(unionAB3.a1);

const unionAB4: UnionAB = {
  a1: 'xxx',
  a2: 'xxx',
  b2: 'xxx',
};

// Error
// Property 'b1' does not exist on type 'UnionAB'.
// Property 'b1' does not exist on type 'A'.
console.log(unionAB4.b1);


// Error
// Type '{ a1: string; b2: string; }' is not assignable to type 'UnionAB'.
// Property 'b1' is missing in type '{ a1: string; b2: string; }' but required in type 'B'.
const unionAB5: UnionAB = {
  a1: 'xxx',
  b2: 'xxx',
};

```

- optional variables in a type are annotated with "?" . This means the values may or may not be passed. works on class variables as well
  example:

```js
type PointXd = {
  x: number;
  y:number;
  z?:number;
}

const p1: PointXd = {x: 1, y:2}
const p2: PointXd = {x: 1, y:2, z: 5}

console.log(p1)
console.log(p2)
```

- Literal Types - This feature permits you to create a set of relationship values.

```js
type Direction = "North" | "South" | "East" | "West";
```

Literal types in this case create also a Type Guard of your field, so the compiler can detect your errors or your typos

```js
let directionError: Direction = "east" // Type '"east"' is not assignable to type 'Direction'
let direction: Direction = "East" // OK

```

- keyof operator helps us to extract the object's properties such as Literal-types

```js
type Person = {
  age: number;
  phone: string;
}

type PersonKeys = keyof Person; // "age" | "phone"

usage with in operator to set all fields to number

type Student = {
  [key in keyof Person]: number ;
}


const student: Student = {
age: 18,
phone: "1252672"    // Type 'string' is not assignable to type 'number'
}

```

- disciminated types
  example

- Not null assertion can be made using "!" operator.
  example: https://dev.to/this-is-learning/typescript-tips-tricks-non-null-assertion-operator-21eb

- Interface and type are somewhat same but types offer much feature . & can be replaced with extends for interface
- Interface supports declaration merging which is same as union in types . if two interfaces with same name exist then their body is merged
  example:

```js
interface Person {
  name: string;
}

interface Person{
  age: number
}

const person: Person =  {name: 'Max', age: 27}; // merged into a single Person interface

console.log(person);

```

- see never type
- when class implements type/interface , it should have all the attributes mentioned in the interface/types . It acts a blueprint
  example:

```js
type Person = {
  age: number;
  phone: string;
}

  // Error below: Type 'Student' is missing the following properties from type 'Person': age, phone

class Student implements Person{
  id: string
}



```

- definitive assignment(!) is used to tell typescript that the value will be defined and it is upto you to make sure its defined.

```js

let person: string


 function test(){
  person = "rubin"
 }

 test()

 console.log(person)  // error TS2454: Variable 'person' is used before being assigned.

Even though person is initialized inside the test function, typescript doesnot know this.
To tell typescript that this value will always be non null,  add "!" and the error goes away

let person!: string



```

- Type guards are used with "is" keyword and used to assert if a value is of certain type.

```js
type Rectangle ={
    length: number,
    breadth: number
}


type Square ={
  size: number
}

type Shape = Rectangle | Square;

function isRectangle(shape: Shape): shape is Rectangle {
  return "length" in shape && "breadth" in shape;
}

function isSquare(shape: Shape): shape is Square{
  return "size" in shape;
}


function printArea(shape: Shape) {
    if (isRectangle(shape)) {
        console.log(shape.length * shape.breadth);
    }
    if(isSquare(shape)){
      console.log(shape.size * shape.size);
    }


}

Here we are telling typescript if the function returns true,
the value is of type "Person"


Notice: the guard can also be defined as
function isSquare(shape: Shape): boolean{
  return "size" in shape;
}

However typescript wont know the shape is "Square" even if it returns true
so its best to use the above for type checking



```

- An abstract class is typically used to define common behaviors for derived classes to extend. Unlike a regular class, an abstract class cannot be instantiated directly. The unimplemented methods are to be implemented and defined by the classes that extends it

```js
abstract class Logger{
 abstract prefix(): string

log(message: string){
    console.log(this.prefix() +":"+ message)
}
}

class ConsoleLogger extends Logger{
  prefix(): string {
      return "Console"
  }

}

const logger = new ConsoleLogger()
logger.log("Hello")

```

- Object in js can be accessed with index-signature i.e Obj[key] similar to array . In typescript we can define the type of the index while accessing the object values

```js
type Person= {
  userName: string;
  address: string;
}

const p1: Person = {
  userName: 'alex123',
  address: '123 Main St.',
}
const p2: Person = {
  userName: 'ryan123',
  address: '123 Main St.',
}


type PersonDictionary= {
  [key: string]: Person
}

const persons: PersonDictionary = {
  alex: p1,
  ryan: p2
}

persons['alex'].userName = 'alex567'

console.log(persons['alex'])

```

- Tuples are arrays with fixed length

- Generic constraints are used to require generic parameters to have a particular structure. If you don't specify them and try to access the data's property , typescript will throw error as it does not know the dats structure

```js
const addFullName = <T>(obj: T) => {
  return {...obj, fullName: `${obj.firstName} ${obj.lastName}`};
}
```

Here we have defined a parameter of type generic T. If we try to access, the properties of the parameter,
even if it exists, we get error like ` Property 'lastName' does not exist on type 'T'`. We can fix this by adding generic constraints which tells typescript that the generic has those properties. Additionally, its also requiring the passed value to have properties `firstName` and `lastName`

```js
type NamedVales = {firstName: string, lastName: string};

const addFullName = <T extends NamedVales>(obj: T) => {
 return {...obj, fullName: `${obj.firstName} ${obj.lastName}`};
}
```

- The `typeof` key can be used to extract type from an existing data

```js
const user = {
  name: "Rubin",
  age: 15,
  address: "Kathmandu"
}

type UserType = typeof user  //  {name: string,age:number,address: string}
```

-Look up types are used to extract a portion from a complex type and create a new type

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
