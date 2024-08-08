---
title: sass mixins that are way too good
published: true
description: sass 
tags: sass,css
cover_image: https://res.cloudinary.com/practicaldev/image/fetch/s--7vxCRBOI--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/i/hwr7c2c2najfq9p5ie5k.jpg
# Use a ratio of 100:42 for best results.
# published_at: 2023-06-05 15:33 +0000
---

## All sass font weights:

```
$font-weights: ("thin":100,"extrlight":200,"light": 300,"regular": 400, "medium": 500,"semibold":600, "bold": 700,"extrabold":800,"black":900);
```

### Usage: 

```
.selector{
font-weight: map-get($font-weights, thin);
}
```

## Add CSS vendor prefix:

```
@mixin prefix($declarations, $prefixes: ()) {
  @each $property, $value in $declarations {
    @each $prefix in $prefixes {
      #{'-' + $prefix + '-' + $property}: $value;
    }

    // Output standard non-prefixed declaration
    #{$property}: $value;
  }
}
```

### Usage:
```
.selector {
  @include prefix((
    column-count: 3,
    column-gap: 1.5em,
    column-rule: 2px solid hotpink
  ), webkit moz);
}
```

## Breakpoints

```
$bp: (
  mobile: 480px,
  tablet: 768px,
  desktop: 1440px
);

@mixin query($display) {
  @each $key, $value in $bp {
    //  defining min-width
    @if ($display == $key) {
      @media (min-width: $value) {
        @content;
      }
    }
  }
}
```
### Usage:
```
.selector{
  display: flex;
  @include query(mobile) {
    flex-direction: column;

    // you can pick any value you wish.
    height: 500px;
  }
}
```
