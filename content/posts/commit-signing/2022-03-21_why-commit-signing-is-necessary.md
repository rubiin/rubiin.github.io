---
title: Why commit signing is necessary
date: 2022-03-21
featured: true
draft: false
slug: '/blog/why-commit-signing-is-necessary/'
description:
cover_image: https://res.cloudinary.com/practicaldev/image/fetch/s--OPEh7WV8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://zupimages.net/up/19/14/0oul.png
tags:
  - git
  - security
---

In git , when you are pushing code to origin a.k.a the remote server, out of the box, it uses email address and name to distinguish between commits made by individual users.So you can identify the commits made by you or your coworker by simply checking at git log
A simple git log would output you some info like this
![Git log!](https://i.imgur.com/FxvBZv6.png)

As you can see , a name and email under the author tag is associated with every commit hash.
Since this info is readily available to anyone who can view the repo ,anyone can mimic a user by just changing their their git config file and adding the targets' name and email address so that if he/she has permission to push changes to that particular repo,then all the commits done from now onwards would look like its being done by the target. That's where commit signing comes into play and helps to mitigate this.

Signing a commit involves using your private key to create a unique digital fingerprint, or signature, for that commit. This signature is like a stamp that only your private key can create. When you share your public key with platforms such as GitHub, they can use it to verify the signature on your commits. This verification process ensures that the commits you claim to have made actually come from you, adding a layer of security and trust to the collaboration process. It helps others know that the code changes or contributions attributed to you are authentic and haven't been tampered with.

### Further reading

- https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits
- https://docs.gitlab.com/ee/user/project/repository/gpg_signed_commits/