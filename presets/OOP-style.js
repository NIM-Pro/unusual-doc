var Class=require('../classes.js');

var setSimpleGetter=function(object,name,value) {
    object.__defineGetter__(name,function() {
        return value;
    });
};

var Element=Class(function(){});

Element.prototype.visible=false;
Element.prototype.toString=function(){return ''};

var Type=Class(function(name){
    this.name=name;
},Element);

setSimpleGetter(Type.prototype,'isType',true);
Type.prototype.toString=function(){return this.name.toString()};

Type.handle=function(token,args,result) {
    return new Type(token);
};

var ComplexType=Class(function(name,innerType){
    if (innerType.isType)
        this.innerType=innerType;
    else
        this.innerType=null;
},Type);

setSimpleGetter(ComplexType.prototype,'isComplexType',true);
ComplexType.prototype.openSym='(';
ComplexType.prototype.closeSym=')';
ComplexType.prototype.toString=function(){
    var out=Type.prototype.toString.call(this);
    if (this.innerType!==null)
        out+=this.openSym+this.innerType.toString()+this.closeSym;
    return out;
};

ComplexType.handle=function(token,args,result) {
    return new ComplexType(token,result);
};

var names={
    'type':Type,
    'complexType':ComplexType
};

module.exports=function(unusual) {
    for (var i in names)
        unusual.registerLink(i,names[i].handle);
};