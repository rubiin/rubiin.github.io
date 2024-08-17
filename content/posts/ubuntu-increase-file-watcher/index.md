---
title: Ubuntu Increase Inotify Watcher (File Watch Limit)
date: "2020-11-01"
featured: false
draft: false
slug: "/blog/ubuntu-increase-file-watcher/"
cover_image: "./cover.webp"
tags:
  - ubuntu
  - linux
---

## Overview

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

## Conclusion

Increasing the inotify watchers can prevent issues related to file system monitoring, especially for applications like development tools or servers that handle numerous files or directories.Adjusting the number of inotify watchers on Ubuntu is crucial for applications that monitor many files or directories, such as development tools and servers. By increasing the fs.inotify.max_user_watches limit, you can prevent issues related to file monitoring limits and ensure your application runs smoothly. This adjustment can be made temporarily or permanently, depending on your needs, and helps maintain optimal performance and functionality for applications relying on file system events.
