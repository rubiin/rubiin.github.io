---
title: Ubuntu Increase Inotify Watcher (File Watch Limit)
date: '2020-11-01'
featured: false
draft: false
slug: '/blog/caching-expressjs-app/'
cover_image: https://scx1.b-cdn.net/csz/news/800/2019/ubuntu.jpg
tags:
  - ubuntu
  - linux
---

## Technical Details

> Possible cause of Vue.js hot reload or LiveReload not working and failed file watchers on IDE

Listen uses inotify by default on Linux to monitor directories for changes. It's not uncommon to encounter a system limit on the number of files you can monitor. For example, Ubuntu Lucid's (64bit) inotify limit is set to 8192.

The current default is 8192 (see fs/notify/inotify/inotify_user.c in the kernel source), you can verify this by printing the file to stdout:

```sh
cat /proc/sys/fs/inotify/max_user_watches
8192
```

You can bump the number up, for example, doubling this to 16384, using:

```sh
echo 16384 | sudo tee /proc/sys/fs/inotify/max_user_watches
```

bear in mind that inotify watches do consume memory, I think it's around 160 bytes per watch on 64 bit systems.

To set this permanently, add an entry to /etc/sysctl.conf, for example:

```sh
echo fs.inotify.max_user_watches=16384 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

..or manually edit /etc/sysctl.conf (you need root privileges to update it) and then run

```sh
sudo sysctl -p
```
