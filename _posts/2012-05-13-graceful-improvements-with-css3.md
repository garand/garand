---
layout: post
title: Graceful Improvements with CSS3
---

I've been using CSS3 on a number of projects recently and I'd like to share a few things I've found useful when using things such as `linear-gradient`, `box-shadow`, and `rgba` values in my designs, while not forgoing support for browsers that have yet to support these features.

There are a variety of scripts that will tell you if an element can use these new features, I prefer to use purely CSS where I can.

I'm continuing with the assumption that you know how to use these, if you don't, I suggest you take a look at these before continuing:

*   [Linear Gradient][6]
*   [Box Shadow][7]
*   [RGBA][8]

## Linear Gradient

Generally gradients are used as backgrounds for a website, div, or other similar content wrapper on a website. This is a place where the gradient is not typically required, but rather is there to improve the look of the site. A technique I've used frequently to continue to use `linear-gradient`'s but still have the site function in older browsers is setting a `background-color` before setting the gradient. Typically I go with a color halfway between both colors for the gradient so I end up with a nice mid-tone for the background in older browsers, depending on your design you may choose to opt for something different.

```css
body {
  background:gray;
  background-image:linear-gradient(black,white);
}
```

## Box Shadow

This is another property that is generally a visual addition rather than being a required component. The way I've gotten around lack of support in older browsers is by setting a border on the element in addition to the `box-shadow` and then removing that border on browsers that support `box-shadow`'s. Here's an example of my technique:

```css
.shadow {
  border-right:1px solid #999;
  border-left:1px solid #999;
  border-bottom:2px solid #777;
  border:0 solid rgba(0,0,0,0);
  box-shadow:0 1px 2px #666;
}
```

You'll notice I have an extra border declaration, `border:0 solid rgba(0,0,0,0)`, what that does is sets a 0px border and sets the color to completely transparent black. Browsers that support `rgba` will remove the border set before, and browsers that do not will disregard the line entierly.

## RGBA

RGBA has proven to be a very powerful feature in CSS3 for me. It allows you to set RGB values as you have done in the past, but with one extra property, transparency. The alpha level is set in the last attribute as a decimal value with 1 being completely opaque and .5 being 50% opaque. A trick I have used in combination wtih RGBA is also setting the same property with an RGB value one line before. Here is an example:

```css
.rgba {
  color:rgb(50,50,50);
  color:rgba(0,0,0,.7);
}
```

Similar to the last example, this sets the color with RGB and then sets the color with RGBA, which will be ignored by browsers that do not support it.

[6]: http://dochub.io/#css/linear-gradient
[7]: http://dochub.io/#css/box-shadow
[8]: http://css-tricks.com/rgba-browser-support/