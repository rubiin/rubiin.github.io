---
title: Useful aliases for docker
date: 2024-06-30
featured: false
draft: false
slug: "/blog/useful-aliases-for-docker/"
description:
cover_image: "./cover.png"
# Use a ratio of 100:42 for best results.
tags:
  - docker
  - devops
---

Docker has been there for a long time and its my top most used tool whether for spinning up a web server or trying out a new tool.
If you are like me and use docker on your day to day dev workflow, these aliases would help you save few keystrokes for common use cases and save your time.
You can set up in your shell configuration file (like .bashrc, .zshrc, etc.):

### Get latest container ID

```bash
alias dl="docker ps -l -q"
```

### Get container process

```bash
alias dps="docker ps"
```

### Get process included stop container

```bash
alias dpa="docker ps -a"
```

### Get images

```bash
alias di="docker images"
```

### Get container IP

```bash
alias dip="docker inspect --format '{{ .NetworkSettings.IPAddress }}'"
```

### Run daemonized container

```bash
alias dkd="docker run -d -P"
```

### Run interactive container

```bash
alias dki="docker run -i -t -P"
```

### Execute interactive container

```bash
alias dex="docker exec -i -t"
```

### Stop all containers

```bash
alias dstop='docker stop $(docker ps -a -q)'
```

### Remove all containers

```bash
alias drm='docker rm $(docker ps -a -q)'
```

### Stop and Remove all containers

```bash
alias drmf='docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q)'
```

### Remove all images

```bash
alias dri='docker rmi $(docker images -q)'
```

### Dockerfile build

```bash
alias dbu='docker build -t=$1 .'
```

### Show all alias related docker

```bash
dalias() { alias | grep 'docker' | sed "s/^\([^=]*\)=\(.*\)/\1 => \2/" | sed "s/['|\']//g" | sort; }
```

### Bash into running container

```bash
alias dbash='docker exec -it $(docker ps -aqf "name=$1") bash'
```
