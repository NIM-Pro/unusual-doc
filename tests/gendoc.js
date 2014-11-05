var UnusualDoc=require('..');
var TextsParse=require('./texts-parse.js');
var fs=require('fs');
var Texts=TextsParse(fs.readFileSync('./gendoc.texts.md','utf-8'));

var u=new UnusualDoc({
    blockBeginning:'/**',
    blockEnding:'**/',
});

u.registerLink('array',function(token) {
    return 'array of '+token;
});

u.registerLink('type',function(token) {
    return token;
});

var metaToString=function() {
    return Texts[this.name];
};

u.registerLink('meta',function(token) {
    return {
        name:token,
        toString:metaToString
    };
});

var functionToString=function() {
    var res='function';
    if (this.name!==null) {
        if (!!this.className)
            res+=' '+this.className+'.'+this.name;
        else
            res+=' '+this.name;
    };
    if (this.args!==null)
        res+='('+this.args.join(',')+')';
    if (this.result!==null)
        res+=' '+this.result;
    return res;
};

var functionLink=u.registerLink('function',function(token,args,result) {
    return {
        type:'function',
        name:token,
        args:args,
        result:result,
        toString:functionToString
    };
});

var classToString=function() {
    var res='class';
    if (this.name!==null) res+=' '+this.name;
    if (this.constructor.args!==null)
        res+='('+this.constructor.args.join(',')+')';
    return res;
};

u.registerLink('class',function(token,args,result) {
    return {
        type:'class',
        name:token,
        constructor:functionLink(null,args,null),
        methods:[],
        toString:classToString
    };
});

u.registerLink('method',function(token,args,result) {
    var Class=args.splice(0,1)[0];
    var f=functionLink(token,args,result);
    f.className=Class.name+'.prototype';
    Class.methods.push(f);
    return f;
});

u.parseFile('../unusual-doc.js').then(function(data) {
    data.filter(function(e) {
        return e!==null;
    }).forEach(function(d) {
        var t=d.toString()
        if (!!d.type)
            if (d.type==='class'||d.type==='function')
                t='#### '+t;
        console.log(t);
    });
}).catch(function(e) {
    if (!!e.stack) console.log(e.stack);
    else console.log(e);
});