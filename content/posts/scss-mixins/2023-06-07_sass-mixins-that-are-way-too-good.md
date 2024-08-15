---
title: sass mixins that are way too good
date: 2023-06-05
featured: false
draft: false
slug: "/blog/sass-mixins-that-are-way-too-good/"
description:
cover_image: "./cover.jpg"
tags:
  - sass
  - css
---

## All sass font weights:

```scss
$font-weights: (
  "thin": 100,
  "extrlight": 200,
  "light": 300,
  "regular": 400,
  "medium": 500,
  "semibold": 600,
  "bold": 700,
  "extrabold": 800,
  "black": 900,
);
```

### Usage

```scss
.selector {
  font-weight: map-get($font-weights, thin);
}
```

## Add CSS vendor prefix:

```scss
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

### Usage

```scss
.selector {
  @include prefix(
    (
      column-count: 3,
      column-gap: 1.5em,
      column-rule: 2px solid hotpink,
    ),
    webkit moz
  );
}
```

## Breakpoints

```scss
$bp: (
  mobile: 480px,
  tablet: 768px,
  desktop: 1440px,
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

### Usage

```scss
.selector {
  display: flex;
  @include query(mobile) {
    flex-direction: column;

    // you can pick any value you wish.
    height: 500px;
  }
}
```
