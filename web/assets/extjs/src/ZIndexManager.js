Ext.define("Ext.ZIndexManager",{alternateClassName:"Ext.WindowGroup",statics:{zBase:9000},constructor:function(a){var b=this;b.list={};b.zIndexStack=[];b.front=null;if(a){if(a.isContainer){a.on("resize",b._onContainerResize,b);b.zseed=Ext.Number.from(b.rendered?a.getEl().getStyle("zIndex"):undefined,b.getNextZSeed());b.targetEl=a.getTargetEl();b.container=a}else{Ext.EventManager.onWindowResize(b._onContainerResize,b);b.zseed=b.getNextZSeed();b.targetEl=Ext.get(a)}}else{Ext.EventManager.onWindowResize(b._onContainerResize,b);b.zseed=b.getNextZSeed();Ext.onDocumentReady(function(){b.targetEl=Ext.getBody()})}},getNextZSeed:function(){return(Ext.ZIndexManager.zBase+=10000)},setBase:function(b){this.zseed=b;var a=this.assignZIndices();this._activateLast();return a},assignZIndices:function(){var c=this.zIndexStack,b=c.length,e=0,g=this.zseed,d,f;for(;e<b;e++){d=c[e];if(d&&!d.hidden){g=d.setZIndex(g);if(d.modal){f=d}}}if(f){this._showModalMask(f)}return g},_setActiveChild:function(b,a){var c=this.front,d=b.preventFocusOnActivate;if(b!==c){if(c&&!c.destroying){c.setActive(false,b)}this.front=b;if(b&&b!=a){b.preventFocusOnActivate=b.preventFocusOnActivate||a&&(a.preventFocusOnActivate||!a.focusOnToFront);b.setActive(true);if(b.modal){this._showModalMask(b)}b.preventFocusOnActivate=d}}},onComponentHide:function(a){this._activateLast()},_activateLast:function(){var d=this,a=d.zIndexStack,c=a.length-1,b;for(;c>=0&&a[c].hidden;--c){}if((b=a[c])){d._setActiveChild(b,d.front);if(b.modal){return}}else{if(d.front&&!d.front.destroying){d.front.setActive(false)}d.front=null}for(;c>=0;--c){b=a[c];if(b.isVisible()&&b.modal){d._showModalMask(b);return}}d._hideModalMask()},_showModalMask:function(b){var d=this,g=b.el.getStyle("zIndex")-4,c=b.floatParent?b.floatParent.getTargetEl():b.container,a=d.mask,f=d.maskShim,e;if(!a){if(Ext.isIE6){f=d.maskShim=Ext.getBody().createChild({tag:"iframe",cls:Ext.baseCSSPrefix+"shim "+Ext.baseCSSPrefix+"mask-shim"});f.setVisibilityMode(Ext.Element.DISPLAY)}a=d.mask=Ext.getBody().createChild({cls:Ext.baseCSSPrefix+"mask",style:"height:0;width:0"});a.setVisibilityMode(Ext.Element.DISPLAY);a.on("click",d._onMaskClick,d)}a.maskTarget=c;e=d.getMaskBox();if(f){f.setStyle("zIndex",g);f.show();f.setBox(e)}a.setStyle("zIndex",g);a.show();a.setBox(e)},_hideModalMask:function(){var b=this.mask,a=this.maskShim;if(b&&b.isVisible()){b.maskTarget=undefined;b.hide();if(a){a.hide()}}},_onMaskClick:function(){if(this.front){this.front.focus()}},getMaskBox:function(){var a=this.mask.maskTarget;if(a.dom===document.body){return{height:Math.max(document.body.scrollHeight,Ext.dom.Element.getDocumentHeight()),width:Math.max(document.body.scrollWidth,document.documentElement.clientWidth),x:0,y:0}}else{return a.getBox()}},_onContainerResize:function(){var c=this,b=c.mask,a=c.maskShim,d;if(b&&b.isVisible()){b.hide();if(a){a.hide()}d=c.getMaskBox();if(a){a.setSize(d);a.show()}b.setSize(d);b.show()}},register:function(b){var c=this,a=b.afterHide;if(b.zIndexManager){b.zIndexManager.unregister(b)}b.zIndexManager=c;c.list[b.id]=b;c.zIndexStack.push(b);b.afterHide=function(){a.apply(b,arguments);c.onComponentHide(b)}},unregister:function(a){var b=this,c=b.list;delete a.zIndexManager;if(c&&c[a.id]){delete c[a.id];delete a.afterHide;Ext.Array.remove(b.zIndexStack,a);b._activateLast()}},get:function(a){return a.isComponent?a:this.list[a]},bringToFront:function(b,d){var c=this,a=false,e=c.zIndexStack;b=c.get(b);if(b!==c.front){Ext.Array.remove(e,b);if(b.preventBringToFront){e.unshift(b)}else{e.push(b)}c.assignZIndices();if(!d){c._activateLast()}a=true;c.front=b;if(b.modal){c._showModalMask(b)}}return a},sendToBack:function(a){var b=this;a=b.get(a);Ext.Array.remove(b.zIndexStack,a);b.zIndexStack.unshift(a);b.assignZIndices();this._activateLast();return a},hideAll:function(){var b=this.list,a,c;for(c in b){if(b.hasOwnProperty(c)){a=b[c];if(a.isComponent&&a.isVisible()){a.hide()}}}},hide:function(){var d=0,b=this.zIndexStack,a=b.length,c;this.tempHidden=[];for(;d<a;d++){c=b[d];if(c.isVisible()){this.tempHidden.push(c);c.el.hide();c.hidden=true}}},show:function(){var c=0,d=this.tempHidden,a=d?d.length:0,b;for(;c<a;c++){b=d[c];b.el.show();b.hidden=false;b.setPosition(b.x,b.y)}delete this.tempHidden},getActive:function(){return this.front},getBy:function(f,e){var g=[],d=0,b=this.zIndexStack,a=b.length,c;for(;d<a;d++){c=b[d];if(f.call(e||c,c)!==false){g.push(c)}}return g},each:function(c,b){var d=this.list,e,a;for(e in d){if(d.hasOwnProperty(e)){a=d[e];if(a.isComponent&&c.call(b||a,a)===false){return}}}},eachBottomUp:function(f,e){var b=this.zIndexStack,d=0,a=b.length,c;for(;d<a;d++){c=b[d];if(c.isComponent&&f.call(e||c,c)===false){return}}},eachTopDown:function(e,d){var a=this.zIndexStack,c=a.length,b;for(;c-->0;){b=a[c];if(b.isComponent&&e.call(d||b,b)===false){return}}},destroy:function(){var b=this,c=b.list,a,d;for(d in c){if(c.hasOwnProperty(d)){a=c[d];if(a.isComponent){a.destroy()}}}delete b.zIndexStack;delete b.list;delete b.container;delete b.targetEl}},function(){Ext.WindowManager=Ext.WindowMgr=new this()});