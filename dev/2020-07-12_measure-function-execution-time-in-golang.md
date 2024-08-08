---
title: Measure function execution time in golang
published: true
description: 
tags: golang,function,go
cover_image: https://yourbasic.org/golang/100m-sprint.jpg
---

For some reason you may want to keep a track of how much long a function takes to do a certain task in golang, maybe for performance evaluation.Here is a function that tracks the execution time of a complete function call with this one-liner, which logs the result to the standard output.

```go
func timeTrack(start time.Time, name string) {
	elapsed := time.Since(start)
	log.Printf("%s took %s", name, elapsed)
}

```

The usage is fairly simple and straight forward. Defer the call to this function before doing the actual function call.

```go

package main

import "fmt"

func main() {

defer timeTrack(time.Now(), "Timer")

// your code goes here


}

```

