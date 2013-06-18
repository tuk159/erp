Ext.define("Ext.data.Tree",{alias:"data.tree",mixins:{observable:"Ext.util.Observable"},root:null,constructor:function(a){var b=this;b.mixins.observable.constructor.call(b);if(a){b.setRootNode(a)}b.on({scope:b,idchanged:b.onNodeIdChanged,insert:b.onNodeInsert,append:b.onNodeAppend,remove:b.onNodeRemove})},getRootNode:function(){return this.root},setRootNode:function(b){var a=this;a.root=b;if(b.rootOf){b.rootOf.removeRootNode()}else{if(b.parentNode){b.parentNode.removeChild(b)}}b.rootOf=a;if(b.fireEventArgs("beforeappend",[null,b])!==false){b.set("root",true);b.updateInfo(true,{isFirst:true,isLast:true,depth:0,index:0,parentId:null});a.nodeHash={};b.fireEvent("append",null,b);b.fireEvent("rootchange",b)}return b},removeRootNode:function(){var b=this,a=b.root;a.set("root",false);a.fireEvent("remove",null,a,false);a.fireEvent("rootchange",null);a.rootOf=b.root=null;return a},flatten:function(){return Ext.Object.getValues(this.nodeHash)},onNodeInsert:function(a,b){this.registerNode(b,true)},onNodeAppend:function(a,b){this.registerNode(b,true)},onNodeRemove:function(a,b){this.unregisterNode(b,true)},onNodeIdChanged:function(d,e,b,a){var c=this.nodeHash;c[d.internalId]=d;delete c[a]},getNodeById:function(a){return this.nodeHash[a]},registerNode:function(f,a){var e=this,c,d,b;e.nodeHash[f.internalId]=f;if(a===true){c=f.childNodes;d=c.length;for(b=0;b<d;b++){e.registerNode(c[b],true)}}},unregisterNode:function(f,a){var e=this,c,d,b;delete e.nodeHash[f.internalId];if(a===true){c=f.childNodes;d=c.length;for(b=0;b<d;b++){e.unregisterNode(c[b],true)}}},sort:function(b,a){this.getRootNode().sort(b,a)},filter:function(b,a){this.getRootNode().filter(b,a)}});