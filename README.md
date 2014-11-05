# Unusual Doc

**This** is really unusual tool for documentation generating.

[![NPM](https://nodei.co/npm/unusual-doc.png?compact=true)](https://nodei.co/npm/unusual-doc/)

**Why?** You will understand in the example.

## First. Write the comments in your code.

``` js
/*---
@foo=@class Foo(@type string);

@classMethod Bar(@foo,@type string) @type array;

@method bar(@foo,@type integer) @type array;
*/
```

**This** involves the use of two things: **links** and **variables**.

### Links

**Links** are references to external functional. And his behavior is determined by you.

**Link** structure: `@name Token(arguments) result;`.

Requires only a name, the rest can be ignored.

That is, the links can be:

1. `@name;`
2. `@name Token;`
3. `@name Token(arguments);`
4. `@name Token(arguments) result;`
5. `@name Token result;`
6. `@name(arguments);`
7. `@name(arguments) result;`
8. `@name result;`

`;` can be omitted if after no more operands.

**Arguments** and **result** may be **links** or **variables**.

### Variables

**Variables** are not as flexible as **links** and can look just as `@var`.

Recording **variable** is possible only at the beginning of an operand.

Сorrectly: `@foo=@class Foo;`.

Not correctly: `@method(@foo=@class Foo);`.

**Variable** can not be expanded.

Not correctly: 
```
@foo=@class Foo;
@foo(@string);
```

## Second. Require this and declare functional.

``` js
var UnusualDoc=require('unusual-doc');

var u=new UnusualDoc;

u.registerLink('type',function(token) {
    return token;
});

var functionLink=u.registerLink('function',function(token,args,result) {
    return {
        type:'function',
        name:token,
        args:args,
        result:result
    };
});

u.registerLink('class',function(token,args,result) {
    return {
        type:'class',
        name:token,
        constructor:functionLink(null,args,null),
        classMethods:[],
        instanceMethods:[]
    };
});

u.registerLink('classMethod',function(token,args,result) {
    var Class=args.splice(0,1)[0];
    Class.classMethods.push(functionLink(token,args,result));
    return null;
});

u.registerLink('method',function(token,args,result) {
    var Class=args.splice(0,1)[0];
    Class.instanceMethods.push(functionLink(token,args,result));
    return null;
});

u.parseFile('./test-code.js').then(function(data) {
    data.filter(function(e) {
        return e!==null;
    }).forEach(function(d) {
        console.log(d);
    });
}).catch(function(e) {
    if (!!e.stack) console.log(e.stack);
    else console.log(e);
});
```

### What you need to know?

You can return anything you want.

In the **arguments** and the **result** you get the data that was returned by YOU.

You can return the **promise** and then the parser will wait for its implementation.

### API

#### class UnusualDoc(object)

Arguments:

* `object` - contains **options**.

List of **options**:

* `blockBeginning` - default: `'/*---'`. Begin of sought to parse the block.
* `blockEnding` - default: `'*/'`. End of sought to parse the block.
* `fileEncoding` - default: `'utf-8'`. Encoding files. Used by **parseFile** method.

Example:
```js
var u=new UnusualDoc({
    blockBeginning:'/*[DOC]',
    blockEnding:'[/DOC]*/',
    fileEncoding:'ascii'
});

```

#### function UnusualDoc.prototype.registerLink(string,function(string,array of link,link) anything)

Register process-function for link.

Arguments:

* `string` - name of link.
* `function` - **callBack** that will be called to process the link.

**Returns** given `function`.

**CallBack**'s arguments:

* `string` - token
* `array of link` - arguments
* `link` - result

Example:
```js
var functionLink=u.registerLink('function',function(token,args,result) {
    return {
        type:'function',
        name:token,
        args:args,
        result:result
    };
});
```

#### function UnusualDoc.prototype.registerLink(function(string,string,array of link,link) anything)

Register default process-function for link. Will be called if the link has not been assigned processor.

Arguments:

* `function` - **callBack** that will be called to process the link.

**Returns** given `function`.

**CallBack**'s arguments:

* `string` - name of link
* `string` - token
* `array of link` - arguments
* `link` - result

Example:
```js
u.registerLink(function(name,token,args,result) {
    return {
        type:name,
        name:token,
        args:args,
        result:result
    };
});
```

#### function UnusualDoc.prototype.parse(string)

Parse given code.

Arguments

* `string` - code.

**Returns** a promise that will be passed an array of results.

Example:
```js
u.parse(readedCode).then(function(data) {
    console.log(data);
}).catch(function(e) {
    if (!!e.stack) console.log(e.stack);
    else console.log(e);
});
```

#### function UnusualDoc.prototype.parseFile(string)

Read and parse file by given name.

Arguments

* `string` - filename.

**Returns** result of **parse** method.

Example:
```js
u.parseFile(filename).then(function(data) {
    console.log(data);
}).catch(function(e) {
    if (!!e.stack) console.log(e.stack);
    else console.log(e);
});
```

## Third. See result.
```json
{
    "type":"class",
    "name":"Foo",
    "constructor":{
        "type":"function",
        "name":null,
        "args":["string"],
        "result":null
    },
    "classMethods":[
        {
            "type":"function",
            "name":"Bar",
            "args":["string"],
            "result":"array"
        }
    ],
    "instanceMethods":[
        {
            "type":"function",
            "name":"bar",
            "args":["integer"],
            "result":"array"
        }
    ]
}

```