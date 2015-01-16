var UnusualDoc=require('..');

var u=new UnusualDoc;

UnusualDoc.presets.declarations.OOPStyle(u);

u.parseFile('./usepresets.txt').then(function(data) {
    return data.map(function(d) {
        return d.toString();
    });
}).then(console.log).catch(function(e) {
    if (!!e.stack)
        console.log(e.stack);
    else
        console.log(e);
});