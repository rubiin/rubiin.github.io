---
title: Getting started with zsh
published: true
description: 
tags: linux,terminal,opensource,cli
cover_image: https://miro.medium.com/max/2644/1*Ai3Da_1OHp1ueh1BmxOM0w.png
---

If you are using Linux or Macos, chances are you have already got your hands dirty with terminal. Being a cli fan, I was a power user who loved working in terminal automating stuff and get most out of the cli. This drove me to search tweaks to boost bash's performance but I ended up finding zsh , a shell designed for interactive use instead . Zsh is pretty powerful and offers cutomizations with tons of plugins.
This is a list of features why I love zsh:
* Command validation
* Directory history
* Spelling correction
* Themeable prompts (Agnoster, RobbyRussell, …)
* Sharing of command history among all running shells
* Smarter completion.  A few examples:
 * context sensitive -- if you have file "name1" and directory "name2", "cd nam&lt;TAB&gt;" completes to "name2/"
 * "tar xf &lt;TAB&gt;" completes to tarballs only.  "unrar x &lt;TAB&gt;" completes to RARs only.  etc. 
 * rsync / scp completion: "rsync host:anything/&lt;TAB&gt;" shows you files on host under anything/
 * also works with rsync:// URLs
 * SSH host completion from ~/.ssh/config & ~/.ssh/known_hosts
 * lots of other smart completions: Rake tasks, git commands & SHAs, dpkg packages, dash-options for most commands, etc etc.
 * bash can do some of the same things, but needs the bash-completion package, usually comes separately
 * zsh always comes with completions -- it's a user-oriented shell
* Filename correction during completion
 * if dir1/x exists and dir2 exists, then "dir/x&lt;TAB&gt;" completes to dir1/x
 * if name1 is a file and name2 is a directory with files in it, "name/&lt;TAB&gt;" completes to "name2/"
* Better ctrl-R behaviour
 * alerts you if your ctrl-R is failing
 * completes it right on the prompt line while showing you what you're searching for below
* ctrl-R, enter a search term, ctrl-R repeatedly to see earlier matches, then hit backspace
 * bash deletes characters in your search term
 * zsh backtracks through the matches you rejected with ctrl-R, i.e. "backspaces" your ctrl-R's
* autopushd option -- every "cd" is implicitly a silent "pushd" so you can "popd" to go back any time
* better popd behaviour if a directory no longer exists
 * zsh will still pop the stack, so subsequent popd's work
 * bash refuses to popd
* incremental history saving option
 * saves after every command
 * my .zsh_history is chronological and always up-to-date, even with multiple shells running
 * in any shell, I can "fc -R ~/.zsh_history" to reload in order to reuse the latest commands
* optional coloured completion (like "ls")
* autocd option -- "executing" a directory will "cd" to it instead
 * e.g. if I start typing /some/dir/file and decide I want to switch to /some/dir instead, I just enter "/some/dir"
* \`some-command\`&lt;TAB&gt; -- expand output of some-command right in your shell line
* can automatically show exit status of last command
 * always know when something failed, even if the output doesn't make it obvious
* can automatically show "time" output if a command takes more than &lt;n&gt; seconds
* usually has the latest UI improvements first
 * most of bash's features originally came from zsh
* probably a lot more that I've forgotten


I also came across Oh-My-Zsh which was delightful community-driven (with 1,300+ contributors) framework for managing your zsh configuration. Includes 200+ optional plugins (rails, git, OSX, hub, capistrano, brew, ant, php, python, etc), over 140 themes to spice up your morning, and an auto-update tool so that makes it easy to keep up with the latest updates from the community.




# Installation

Installation is pretty straight forward and is also mentioned in the git repo of oh-my-zsh.

Fisrtly install zsh and git

```sh
sudo apt install git-core zsh
```



# Basic Installation
Oh My Zsh is installed by running one of the following commands in your terminal. You can install this via the command-line with either curl or wget.

## via curl
```sh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

## via wget
```sh
sh -c "$(wget -O- https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

## Manual inspection
It's a good idea to inspect the install script from projects you don't yet know. You can do that by downloading the install script first, looking through it so everything looks normal, then running it:

```sh
curl -Lo install.sh https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh
sh install.sh

```
# Using Oh My Zsh

## Plugins
Oh My Zsh comes with a shitload of plugins to take advantage of. You can take a look in the plugins directory and/or the wiki to see what's currently available.

## Enabling Plugins
Once you spot a plugin (or several) that you'd like to use with Oh My Zsh, you'll need to enable them in the .zshrc file. You'll find the zshrc file in your $HOME directory. Open it with your favorite text editor and you'll see a spot to list all the plugins you want to load.

```sh
vi ~/.zshrc
```
For example, this might begin to look like this:
```sh
plugins=(
  git
  bundler
  dotenv
  osx
  rake
  rbenv
  ruby
)
```
Note that the plugins are separated by whitespace. Do not use commas between them.

## Using Plugins
Most plugins (should! we're working on this) include a README, which documents how to use them.

## Themes
We'll admit it. Early in the Oh My Zsh world, we may have gotten a bit too theme happy. We have over one hundred themes now bundled. Most of them have screenshots on the wiki. Check them out!

## Selecting a Theme
Robby's theme is the default one. It's not the fanciest one. It's not the simplest one. It's just the right one (for him).

Once you find a theme that you'd like to use, you will need to edit the ~/.zshrc file. You'll see an environment variable (all caps) in there that looks like:

ZSH_THEME="robbyrussell"

To use a different theme, simply change the value to match the name of your desired theme.

You can find more configuration on the [link](https://github.com/robbyrussell/oh-my-zsh)

