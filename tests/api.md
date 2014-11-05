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

