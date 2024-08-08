---
title: Python for nodejs developers
published: true
description: Examples of pythin compared to Node.js for learning
tags: 
# cover_image: https://direct_url_to_image.jpg
# Use a ratio of 100:42 for best results.
# published_at: 2023-08-22 08:50 +0000
---

A cheatsheet on python and nodejs equivalents for developers who use both or are planning a switch from one to another.
This covers the basics

| Topic                | Node.js (JavaScript)                         | Python                                      |
|----------------------|-----------------------------------------------|---------------------------------------------|
| Boolean              | true, false                            | True, False                              |
| Number               | Numbers (integers, floats)             | Numbers (int, float, complex)            |
| String               | 'Single' and "Double" quotes          | 'Single' and "Double" quotes            |
| Array                | Array literals, array methods         | List type, list methods                 |
| Object               | {} Object literals                    | Dictionary type                         |
| Function             | function keyword, arrow functions     | def keyword, lambda functions           |
| Type Check           | typeof operator                       | isinstance() function                   |
| Interpolation        | `${variable}` syntax                   | f-strings (f"{variable}")                |
| If/Else              | if (condition) {} else {}              | if condition: ... else: ...             |
| Ternary              | condition ? true : false              | true_value if condition else false_value|
| For Loop             | for (init; condition; iteration) {}    | for variable in iterable: ...           |
| While Loop           | while (condition) {}                   | while condition: ...                    |
| Switch               | switch (expression) { case x: ... }     | switch case x: ...                      |
| Array Slicing        | array.slice(start, end)               | list[start:end]                         |
| Copying Array        | [...array], array.slice()              | list.copy()                             |
| Appending            | array.push(element)                   | list.append(element)                    |
| Prepending           | array.unshift(element)                | list.insert(0, element)                 |
| Uint8 Arrays         | Binary data handling, streams         | Used for similar purposes               |
| Array Iteration      | forEach, for...of loop                | for item in list: ...                   |
| Looping              | for...in loop                         | for key in dictionary: ...              |
| Mapping              | array.map(callback)                   | map() function                          |
| Filtering            | array.filter(callback)                | filter() function                      |
| Reducing             | array.reduce(callback)                | reduce() function                      |
| Sorting              | array.sort(callback)                  | sorted() function                       |
| Buffers              | Binary data handling, streams         | Used for similar purposes               |
| Allocate Buffer      | Buffer.alloc(size)                     | bytearray(size)                        |
| Endianness           | Native support                        | Struct module for explicit endianness   |
| Hex                  | .toString(16) conversion              | hex() function                          |
| Compare              | .equals() method                      | == or cmp() functions                   |
| Equals               | Buffer.equals()                       | Direct equality check with ==           |
| Maps                 | Key-value pairs handling              | Used for similar purposes               |
| Map Iteration        | map.forEach, for...of loop            | for key, value in map.items(): ...      |
| Objects              | JavaScript objects, key-value pairs   | Python dictionaries                     |
| Default Values       | Default function parameters           | Default function arguments              |
| Destructuring        | Destructuring assignment syntax       | Destructuring assignment syntax         |
| Spread Operator      | Spread array elements                 | Spread iterable elements                |
| Rest Operator        | Collect function arguments            | Collect function arguments              |
| Swapping             | [a, b] = [b, a]                       | a, b = b, a                             |
| Classes              | ES6 class syntax                      | class keyword                           |
| Constructors         | constructor() method                  | __init__() method                       |
| Instantiation        | new ClassName()                       | ClassName()                             |
| "this"               | Refers to current object              | Refers to instance within class         |
| Files                | fs module for file operations         | Built-in file functions                  |
| Creating Files       | fs.writeFileSync(path, data)          | open(path, mode)                        |
| Opening Files        | fs.openSync(path, mode)               | open(path, mode)                        |
| Writing to Files     | fs.writeFileSync(path, data)          | write() method                         |
| Reading from Files   | fs.readFileSync(path, encoding)       | read() method                          |
| Closing Files        | Automatically closed after operations | close() method                         |
| Deleting Files       | fs.unlinkSync(path)                   | remove() method                        |
| File Descriptors     | Not commonly used                     | Utilized for low-level I/O operations  |
| JSON                 | Built-in JSON object                  | Built-in json module                   |
| Parsing JSON         | JSON.parse(jsonString)                | json.loads(jsonString)                 |
| Stringifying JSON    | JSON.stringify(jsonObject)            | json.dumps(jsonObject)                 |
| Asynchronous Programming | Utilizes `async/await` syntax     | Utilizes `async/await` syntax          |
| Errors               | Utilizes built-in Error object        | Utilizes built-in Exception classes    |
| Try/Catch            | try { ... } catch (error) { ... }     | try: ... except Exception as error: ...|
| Exceptions           | throw new Error('Message')            | raise Exception('Message')            |
| Regular Expressions | Utilizes built-in RegExp object          | Utilizes built-in re module               |
| Matching             | regexObj.test(string) or string.match(regex) | re.match(regex, string)                  |
| Searching            | string.search(regex)                       | re.search(regex, string)                 |
| Replacing            | string.replace(regex, replacement)          | re.sub(regex, replacement, string)       |
| Splitting            | string.split(regex)                        | re.split(regex, string)                  |
| Extracting Groups    | Capturing groups using parentheses         | Capturing groups using parentheses      |

