---
title: Shorten urls in your javascript apps
published: true
description: how to shorten urls in your next nodejs app
tags: shortenurl,nodejs,url,backend
cover_image: https://shameem.me/wp-content/uploads/2019/04/wordpress-pretty-link-plugi.jpg
---

In this blog, we will see how shorten urls using NodeJS.

There are pretty much handful of services that offer shortening features like for example bitly. And the popular ones also provide integrations in various platforms like python, javascript, golang to name some few. However most of these comes with the hassle of setting up api keys, pricing and you cannot switch between the providers.

First of all lets start with,
## What is a URL Shortner
A URL shortener is a simple tool that takes a long URL and turns it into whatever URL you would like it to be.

## Why we need it
Sometimes the links to a location or generally to a social platform become so big that it becomes difficult to manage them. A URL shorter will help in managing, track-compile click data, and one important point they promote sharing.

For the sake of this tiny tutorial, we will be using an npm package called
`url-minify`

## Setting Up The Project
Create a separate directory for your project urlshortner or use a project if you have one, open that directory in your favorite IDE. I am using Visual Studio Code here.

> If you are creating a new project, go inside the folder and type npm init , give the necessary details for setting up the project.

Next, we need to download necessary node packages which we discussed earlier, type following command to download them
`npm i url-minify` or `yarn add url-minify`
The above command will update package.json with the dependencies and download the  package inside node_modules folder (but I guess you already knew that 8-) )

## Let’s Do The Coding Part Now

<img width="100%" style="width:100%" src="https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif">

```js
import minify from 'url-minify';

~(async function () {
	console.log(
		await minify('https://rubiin.vercel.app', { provider: 'isgd' }),
	);
// ==> {longUrl: 'https://rubiin.vercel.app',shortUrl: 'https://is.gd/PTkruq'}
})();

```

## Explanation:
The first import statement imports the package. You can give the import any name.
If you are using require type imports, you can do `const minify = require('url-minify')` 
Now to minify a given url, you just have to pass in the url as the first argument followed by an options object where you specify what provider you will be using.
Currently the package supports `6 provides` as of writting this. Switching providers is easy as picking one from the list below. Also the best part is you don't need any api keys. When the minify function is successfully called, you will get a response 
of the format `{longUrl: <long-url>, shortUrl: <short-url>}`.



## Providers supported

Url shortner supports the following providers.

| Provider    | Status |
| ----------- | ------ |
| is.gd       |    ✔️   |
| cdpt.in     |    ✔️   |
| tinu.be     |    ✔️   |
| kroom.tk    |    ✔️   |
| tinyurl.com |    ✔️   |
| 4h.net      |    ✔️   |

Support the library at : https://github.com/rubiin/url-minify


