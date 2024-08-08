---
title: How to manage multiple nodejs version in a single machine using nvm
date: '2021-09-04'
featured: false
draft: false
slug: '/blog/manage-multiple-nodejs-version-in-a-single-machine-using-nvm/'
description:
cover_image: https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png
tags:
  - nodejs
  - javascript
---

Ever got in a situation where you have to use different nodejs versions for different projects. or you want to have the stable and the latest release side by side. Installing the particular release when you need it might seem a probable solution. But what if you need multiple node versions frequently. The above process seems kind of illogical for the purpose. So NVM aka node version manager comes to the rescue allowing you to have more than one version of node on your machine so you can switch the version with just a command.For Mac and Linux the link is http://github.com/creationix/nvm .For windows http://github.com/coreybutler/nvm-windows . All you have to do is go to the links depending upon your machine’s OS and download the latest release.
Getting started
After getting nvm installed on your machines , open up terminal or cmd and type in

```sh
nvm list
```

To list all the node versions installed on the machine. To install a particular node version use

```sh
nvm install <node version number>
```

for example,

```sh
nvm install 16
```

To use a particular node version installed on your machine do

```sh
nvm use <node version>
```

To uninstall a node version, do

```sh
nvm uninstall <node version>
```

You can also pass in optional parameter which is the 32 or 64 bit version you would like to install or uninstall with install and uninstall command.
For help type in

```sh
nvm -help
```

Happy Node’ing
