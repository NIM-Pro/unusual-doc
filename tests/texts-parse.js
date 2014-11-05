var parser=require('./texts.js');
var fs=require('fs');
var Promise=require('promise');

var readFile=Promise.denodeify(fs.readFile);

module.exports=function(data) {
    var data= parser.parse(data);
    var out={};
    data.forEach(function(d) {
        out[d.name]=d.text;
    });
    return out;
};