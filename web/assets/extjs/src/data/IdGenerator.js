Ext.define("Ext.data.IdGenerator",{isGenerator:true,constructor:function(a){var b=this;Ext.apply(b,a);if(b.id){Ext.data.IdGenerator.all[b.id]=b}},getRecId:function(a){return a.modelName+"-"+a.internalId},statics:{all:{},get:function(a){var c,d,b;if(typeof a=="string"){d=b=a;a=null}else{if(a.isGenerator){return a}else{d=a.id||a.type;b=a.type}}c=this.all[d];if(!c){c=Ext.create("idgen."+b,a)}return c}}});