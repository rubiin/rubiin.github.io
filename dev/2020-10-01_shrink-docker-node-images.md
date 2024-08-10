---
title: Shrink docker node images
published: true
description:
tags: docker,node, backend
cover_image: https://miro.medium.com/max/646/1*epfvG4ZmlzhhNCBPvFgC9A.png
---

Working with nodejs on docker made me realize how much node_modules play a part on determining the image build size. I first started with slim node image but as I was working with microservices thus dealing with multiple build images.Even switching at the cost of some node packages not working as supposed to didnt do much good.
![Node](https://devhumor.com/content/uploads/images/August2017/node-modules.jpg)

Luckily I found a niche tool call node-prune which does help in shrinking your node_module size thus reducing the overall image size.
node-prune is a small tool to prune unnecessary files from ./node_modules, such as markdown, typescript source files, and soon.
So I ended up building my own custom imagr with the tool in built.You can check it out at (tinynode)[github.com/rubiin/tinynode]. The usage is fairly simple and you could also look a sample in the readme.
Try it and let me know what you think
