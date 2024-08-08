---
title: Why commit signing is necessary
published: true
description: 
tags: git,gpg
cover_image: https://res.cloudinary.com/practicaldev/image/fetch/s--OPEh7WV8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://zupimages.net/up/19/14/0oul.png
---

In git , when you are pushing code to origin a.k.a the remote server, out of the box, it uses email address and name to distinguish between commits made by individual users.So you can identify the commits made by you or your coworker by simply checking at git log
A simple git log would output you some info like this
![Git log!](https://i.imgur.com/FxvBZv6.png)

As you can see , a name and email under the author tag is associated with every commit hash.
Since this info is readily available to anyone who can view the repo ,anyone can mimic a user by just changing their their git config file and adding the targets' name and email address so that if he/she has permission to push changes to that particular repo,then all the commits done from now onwards would look like its being done by the target. That's where commit signing comes into play and helps to mitigate this.

By signing a commit, other users with your public key can verify the commit was created by the owner of that key. Users can also share their public key with their remote hosting service, such as GitHub, so that commits appear as verified on their website.

### Further reading
- https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits
- https://docs.gitlab.com/ee/user/project/repository/gpg_signed_commits/

