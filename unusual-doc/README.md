# Unusual Doc

**This** is really unusual tool for documentation generating.

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

### API

