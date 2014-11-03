var UnusualDoc=require('../unusual-doc');
var Texts=require('./gendoc.texts.js');

var u=new UnusualDoc({
    blockBeginning:'/**',
    blockEnding:'**/',
});

u.registerLink('type',function(token) {
    return token;
});

var metaToString=function() {
    return Texts[this.name];;
};

u.registerLink('meta',function(token) {
    return {
        name:token,
        toString:metaToString
    };
});

var functionToString=function(className) {
    var res='### function';
    if (this.name!==null) {
        if (!!className)
            res+=' '+className+'.'+this.name;
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
    var res='### class';
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
    Class.methods.push(functionLink(token,args,result));
    return null;
});

u.parseFile('../unusual-doc/unusual-doc.js').then(function(data) {
    data.filter(function(e) {
        return e!==null;
    }).forEach(function(d) {
        console.log(d.toString());
    });
}).catch(function(e) {
    if (!!e.stack) console.log(e.stack);
    else console.log(e);
});