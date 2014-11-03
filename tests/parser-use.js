var parser=require('./parser.js');
var Promise=require('../unusual-doc/node_modules/promise');
var fs=require('fs');

var read=Promise.denodeify(fs.readFile);

read('parser.txt','utf-8').then(function(data) {
    try {
        return parser.parse(data);
    } catch(e) {
        console.log('ERROR!!!');
        console.log(e);
        return {};
    };
}).then(function(data) {
    //return JSON.stringify(data);
    return data;
}).then(function(str) {
    var log;
    log=function(obj,margin) {
        margin=margin||0;
        var marginStr='';
        for (var i=0; i<margin; i++)
            marginStr+=' ';
        if (obj.type==='link') {
            console.log(marginStr+'@'+obj.link+' '+(obj.token||''));
            if (obj.args)
                for (var i=0; i<obj.args.length; i++)
                    log(obj.args[i],margin+2);
            if (!!obj.result) {
                console.log(marginStr+'  Result:');
                log(obj.result,margin+4);
            };
        } else {
            if (obj.type==='var') {
                console.log(marginStr+'@'+obj.name+'=');
                log(obj.link,margin+2);
            } else
                console.log(marginStr+typeof(obj)+' '+obj);
        };
    };
    //log(str);
    str.forEach(function(a) {log(a)});
},function(e) {
    if (!!e.stack)
        console.log(e.stack);
    else
        console.log(e);
});