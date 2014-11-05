var UnusualDoc=require('..');

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

u.parseFile('./parser.txt').then(function(data) {
    data.filter(function(e) {
        return e!==null;
    }).forEach(function(d) {
        console.log(JSON.stringify(d));
    });
}).catch(function(e) {
    if (!!e.stack) console.log(e.stack);
    else console.log(e);
});