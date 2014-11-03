var Promise=require('promise');
var parser=require('./parser.js');
var fs=require('fs');

var readFile=Promise.denodeify(fs.readFile);

var _defaultParams={
    blockBeginning:'/*---',
    blockEnding:'*/',
    fileEncoding:'utf-8'
};

/**
    @d=@class UnusualDoc(@type object);
    @meta UnusualDoc;
**/

function UnusualDoc(params) {
    params=params||{};
    this.links={};
    this.params={};
    for (var i in _defaultParams)
        if (i in params)
            this.params[i]=params[i];
        else
            this.params[i]=_defaultParams[i];
};

UnusualDoc.prototype.defaultFn=function(){return null};

UnusualDoc.prototype.registerLink=function(name,fn) {
    if (arguments.length>1)
        return this.links[name]=fn;
    if (arguments.length>0)
        return this.defaultFn=name;
};

UnusualDoc.prototype._getLinkExecuter=function(name) {
    if (!!this.links[name]) return this.links[name];
    return this.defaultFn.bind(null,name);
};

UnusualDoc.prototype._executeLink=function(object,env) {
    if (!object||object.type!=='link')
        return Promise.resolve(object);
    if (!!env[object.link])
        return env[object.link];
    var executer=this._getLinkExecuter(object.link);
    if (object.args===null) object.args=[];
    return Promise.all([
        Promise.all(object.args.map(function(a) {
            return this._executeLink(a,env);
        }.bind(this))),
        this._executeLink(object.result,env)
    ]).then(function(results) {
        var _args=results[0];
        var _result=results[1];
        return executer(object.token,_args,_result);
    });
};

UnusualDoc.prototype._executeResult=function(object,env) {
    switch (object.type) {
        case 'link':
            return this._executeLink(object,env);
        break;
        case 'var':
            return env[object.name]=this._executeResult(object.link,env);
        break;
        default:
            return new Promise(function(ok,err) {
                err(new Error('PARSE ERROR: UNKNOWN PARSE RESULT.'));
            });
    }
};

UnusualDoc.prototype._executeResults=function(object,env) {
    try {
        return Promise.all(object.map(function(a) {
            return this._executeResult(a,env);
        }.bind(this)));
    } catch(e) {
        return new Promise(function(ok,err) {
            err(e);
        });
    };
};

UnusualDoc.prototype.parse=function(code,env) {
    return new Promise(function(ok,err) {
        code=(code||'').toString();
        env=env||{};
        var beginPos=code.indexOf(this.params.blockBeginning);
        if (beginPos<0) return ok([]);
        code=code.slice(beginPos+this.params.blockBeginning.length);
        var parsed=false;
        var endPos=code.indexOf(this.params.blockEnding);
        var _err,_errPos;
        while (!parsed&&endPos>=0) {
            try {
                var p=parser.parse(code.slice(0,endPos));
                return Promise.all([
                    this._executeResults(p,env),
                    this.parse(code.slice(endPos+this.params.blockEnding.length),env)
                ]).then(function(data) {
                    ok(data[0].concat(data[1]));                        
                },function(e) {
                    err(e);
                });
            } catch(e) {
                _err=e;
                _errPos=endPos;
                endPos=code.indexOf(this.params.blockEnding,endPos+1);
            };
        };
        var msg="PARSE ERROR: INVALID BLOCK.\n"+code.slice(0,160);
        if (_err&&!!_err.message)
            msg+="\n"+_err.message;
        err(new Error(msg));
    }.bind(this));
};

UnusualDoc.prototype.parseFile=function(path) {
    return readFile(path,this.params.fileEncoding).then(function(data) {
        return this.parse(data);
    }.bind(this));
};

module.exports=UnusualDoc;