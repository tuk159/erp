Ext.define("Ext.Shadow",{requires:["Ext.ShadowPool"],localXYNames:{get:"getLocalXY",set:"setLocalXY"},constructor:function(b){var c=this,d,e,a;Ext.apply(c,b);if(!Ext.isString(c.mode)){c.mode=c.defaultMode}e=c.offset;a=Math.floor(e/2);c.opacity=50;switch(c.mode.toLowerCase()){case"drop":if(Ext.supports.CSS3BoxShadow){d={t:e,l:e,h:-e,w:-e}}else{d={t:-a,l:-a,h:-a,w:-a}}break;case"sides":if(Ext.supports.CSS3BoxShadow){d={t:e,l:0,h:-e,w:0}}else{d={t:-(1+a),l:1+a-2*e,h:-1,w:a-1}}break;case"frame":if(Ext.supports.CSS3BoxShadow){d={t:0,l:0,h:0,w:0}}else{d={t:1+a-2*e,l:1+a-2*e,h:e-a-1,w:e-a-1}}break;case"bottom":if(Ext.supports.CSS3BoxShadow){d={t:e,l:0,h:-e,w:0}}else{d={t:e,l:0,h:0,w:0}}break}c.adjusts=d},getShadowSize:function(){var b=this,d=b.el?b.offset:0,a=[d,d,d,d],c=b.mode.toLowerCase();if(b.el&&c!=="frame"){a[0]=0;if(c=="drop"){a[3]=0}}return a},offset:4,defaultMode:"drop",boxShadowProperty:(function(){var b="boxShadow",a=document.documentElement.style;if(!("boxShadow" in a)){if("WebkitBoxShadow" in a){b="WebkitBoxShadow"}else{if("MozBoxShadow" in a){b="MozBoxShadow"}}}return b}()),show:function(d){var b=this,a,c;d=Ext.get(d);a=(parseInt(d.getStyle("z-index"),10)-1)||0;c=d[b.localXYNames.get]();if(!b.el){b.el=Ext.ShadowPool.pull();if(b.fixed){b.el.dom.style.position="fixed"}else{b.el.dom.style.position=""}if(b.el.dom.nextSibling!=d.dom){b.el.insertBefore(d)}}b.el.setStyle("z-index",b.zIndex||a);if(Ext.isIE&&!Ext.supports.CSS3BoxShadow){b.el.dom.style.filter="progid:DXImageTransform.Microsoft.alpha(opacity="+b.opacity+") progid:DXImageTransform.Microsoft.Blur(pixelradius="+(b.offset)+")"}b.realign(c[0],c[1],d.dom.offsetWidth,d.dom.offsetHeight);b.el.dom.style.display="block"},isVisible:function(){return this.el?true:false},realign:function(c,k,i,f){if(!this.el){return}var b=this.adjusts,a=this.el,h=a.dom.style,d,e,g,j;a[this.localXYNames.set](c+b.l,k+b.t);d=Math.max(i+b.w,0);e=Math.max(f+b.h,0);g=d+"px";j=e+"px";if(h.width!=g||h.height!=j){h.width=g;h.height=j;if(Ext.supports.CSS3BoxShadow){h[this.boxShadowProperty]="0 0 "+(this.offset+2)+"px #888"}}},hide:function(){var a=this;if(a.el){a.el.dom.style.display="none";Ext.ShadowPool.push(a.el);delete a.el}},setZIndex:function(a){this.zIndex=a;if(this.el){this.el.setStyle("z-index",a)}},setOpacity:function(a){if(this.el){if(Ext.isIE&&!Ext.supports.CSS3BoxShadow){a=Math.floor(a*100/2)/100}this.opacity=a;this.el.setOpacity(a)}}});