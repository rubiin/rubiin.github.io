---
title: Terminal 101 - Xargs
date: 2024-05-15
featured: false
draft: false
slug: '/blog/terminal-101---xargs/'
description:
cover_image: './cover.webp'
# Use a ratio of 100:42 for best results.
tags:
  - linux
  - terminal
---

xargs is a command in Unix and Unix-like operating systems used to build and execute commands from standard input. It's particularly handy when you want to pass the output of one command as arguments to another command. Here are a few common use cases with examples:

## Deleting multiple files

```sh
find . -name "*.txt" | xargs rm
```

This command finds all files with a .txt extension in the current directory and its subdirectories, then passes them to xargs, which in turn executes rm (remove) command on each file.

## Creating backups

```sh
find /path/to/files -type f -print | xargs -I {} cp {} /path/to/backup
```

This command finds all files in /path/to/files, then uses xargs to copy each file to /path/to/backup.

## Running commands in parallel

```sh
cat list_of_urls.txt | xargs -P 5 -n 1 wget -q
```

This command reads a list of URLs from list_of_urls.txt, then uses xargs with -P option to run wget with up to 5 parallel processes, downloading each URL.

## Searching for files containing specific text

```sh
grep -rl "search_term" /path/to/search | xargs sed -i 's/search_term/replace_term/g'
```

This command finds all files in /path/to/search containing "search_term", then uses xargs to pass each file to sed, replacing "search_term" with "replace_term".

## Conclusion

Overall, xargs is a valuable tool for command-line efficiency, especially when dealing with large datasets or when needing to process a large number of files or arguments. Its ability to optimize command execution and handle complex scenarios makes it an essential part of Unix-like systems' toolkit.
