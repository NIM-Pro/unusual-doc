var UnusualDoc=require('../unusual-doc');

var u=new UnusualDoc();

u.registerLink('type',function(token) {
    return token;
});

var functionToString=function(className) {
    var res='function';
    if (this.name!==null) {
        if (!!className)
            res+=' '+className+'.'+this.name;
        else
            res+=' '+this.name;
    };
    if (this.args!==null)
        res+='('+this.args.join(',')+')';
    if (this.result!==null)
        res+=':'+this.result;
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
    var name='class';
    if (this.name!==null) name+=' '+this.name;
    var res=[name];
    if (this.constructor!==null)
        res.push('constructor '+this.constructor.toString());
    var className=this.name;
    this.classMethods.forEach(function(m) {
        res.push(m.toString(className));
    });
    this.instanceMethods.forEach(function(m) {
        res.push(m.toString(className+'.prototype'));
    });
    return res.join("\n");
};

u.registerLink('class',function(token,args,result) {
    return {
        type:'class',
        name:token,
        constructor:functionLink(null,args,null),
        classMethods:[],
        instanceMethods:[],
        toString:classToString
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
        console.log(d.toString());
    });
}).catch(function(e) {
    if (!!e.stack) console.log(e.stack);
    else console.log(e);
});