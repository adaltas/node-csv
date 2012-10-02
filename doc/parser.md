---
language: en
layout: page
title: "Parsing"
date: 2012-10-02T15:35:24.009Z
comments: false
sharing: false
footer: false
navigation: csv
github: https://github.com/wdavidw/node-csv
---


The library extend the EventEmitter and emit the following events:

*   *row*

```javascript
Emitted by the parser on each line with the line content as an array of fields.
```

*   *end*
*   *error*

<a name="parse"></a>`parse(chars)`
--------------

Parse a string which may hold multiple lines.
Private state object is enriched on each character until 
transform is called on a new line.

