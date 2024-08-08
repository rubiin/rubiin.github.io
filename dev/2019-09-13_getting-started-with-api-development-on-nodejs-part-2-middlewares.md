---
title: Getting started with Api development on Nodejs Part 2 (Middlewares)
published: true
description: 
tags: expressjs,nodejs,middlewares,javascript
cover_image: https://hackernoon.com/hn-images/1*26BcOdrwfRkbGk9OsREyLA.png
---

Last time we learnt the basics of express web framework like how to setup routes,get and post request and soon. In this part we will be talking about middleware which adds more functionality to express framework .Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application's request-response cycle. If you haven't forgtten about the last part , we used body-parser and morgan. These are the examples of 3rd party middlewares , express offers.

Middlewares are often used in the context of Express.js framework and are a fundamental concept for node.js . In a nutshell, its basically a function that has access to the request and response objects of your application. The way I'd like to think about it, is a series of 'checks/pre-screens' that the request goes through before the it is handled by the application. For e.g, Middlewares would be a good fit to determine if the request is authenticated before it proceeds to the application and return the login page if the request is not authenticated or for logging each request. A lot of third-party middlewares are available that enables a variety of functionality.

Simple Middleware example:

```javascript
var app = express();
app.use(function(req,res,next)){
    console.log("Request URL - "req.url);
    next();
}
```

The above code would be executed for each request that comes in and would log the request url, the next() method essentially allows the program to continue. If the next() function is not invoked, the program would not proceed further and would halt at the execution of the middleware.




Based on the usage, Expressjs classifies them in the following types:

* Application-level middleware
* Router-level middleware
* Error-handling middleware
* Built-in middleware
* Third-party middleware




## Application level middleware

Think of this as a global middleware .i.e all the routes in  your application goes through this middleware. . The application level middleware, which is what we've been using this example above because when we do the app.use, we're saying this entire application instance is going use this middleware right here.
It doesn't matter what router whenever a request comes in, it's always going run through .This type of middleware is handy when you want to impose certain thing on every route in your application like authentication, logging to name few.


<b>Example:</b> 

```javascript
app.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})
```


## Router-level middleware

Router-level middleware works in the same way as application-level middleware, except it is bound to an instance of express.Router().

const router = express.Router()
Load router-level middleware by using the router.use() and router.METHOD() functions.

<b>Example:</b> 

```javascript
const express = require('express');

const app = express();

const router = express.Router()

router.use((req,res,next)=>{
 console.log('Time:', Date.now())
  next()
})

```

The difference between the above and this one is that only the routes defined in the router will be using this middleware.

## Error handling middleware

Error handling middleware is a little different than regular middleware.  Like all the other middleware, it is a function, just it takes in one extra argument, and that's an error. As a first argument, you actually have to put that there.You don't put there, express won't think that you're making an error middleware. It will just be like, this is regular middleware. If you put error, request, response, and then next. Now, expressing those you're doing errors.

<b>Example:</b> 

```javascript

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

```


## Built-in middleware

Starting with version 4.x, Express no longer depends on Connect. The middleware functions that were previously included with Express are now in separate modules; see the list of middleware functions.

Express has the following built-in middleware functions:

* express.static serves static assets such as HTML files, images, and so on.
* express.json parses incoming requests with JSON payloads. NOTE: Available with Express 4.16.0+
* express.urlencoded parses incoming requests with URL-encoded payloads. NOTE: Available with Express 4.16.0+

## Third-party Middlewares

In some cases we will be adding some extra features to our backend. Those are the cases where 3rd party middlewares comes into play. Remember morgan and body-parser? They are the examples of these


<b>Example:</b>  body-parser

All middlewares will populate the req.body property with the parsed body when the Content-Type request header.


<b>app.use({urlencoded:false})</b>

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json())

app.post('/save',(req,res)=>{
  res.json({
    "status":true,
    "payload":req.body
  })
}
          
app.listen(3000,(req,res)=>{
    console.log('server running on port')
})

```

For a partial list of third-party middleware functions that are commonly used with Express, see: Third-party [middleware](https://expressjs.com/en/resources/middleware.html).


Couple of things to keep in mind while using middlewares: 

* The order of middlewares in your application matters, as the request would go through each one in a sequential order.
* Forgetting to call the next() method in your middleware function can halt the processing of your request.
* Any change the req and res objects in the middleware function, would make the change available to other parts of the application that uses req and res


On the next post, we will be looking into templating engines which renders compiled html on express.

