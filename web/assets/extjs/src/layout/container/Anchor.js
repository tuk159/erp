Ext.define("Ext.layout.container.Anchor",{alias:"layout.anchor",extend:"Ext.layout.container.Auto",alternateClassName:"Ext.layout.AnchorLayout",type:"anchor",defaultAnchor:"100%",parseAnchorRE:/^(r|right|b|bottom)$/i,manageOverflow:true,beginLayoutCycle:function(c){var h=this,a=0,f,j,e,d,b,g;h.callParent(arguments);e=c.childItems;b=e.length;for(d=0;d<b;++d){j=e[d];f=j.target.anchorSpec;if(f){if(j.widthModel.calculated&&f.right){a|=1}if(j.heightModel.calculated&&f.bottom){a|=2}if(a==3){break}}}c.anchorDimensions=a;h.sanityCheck(c)},calculateItems:function(g,a){var p=this,k=g.childItems,f=k.length,n=a.gotHeight,h=a.gotWidth,e=a.height,c=a.width,b=(h?1:0)|(n?2:0),o=g.anchorDimensions,l,r,m,q,j,d;if(!o){return true}for(j=0;j<f;j++){r=k[j];m=r.getMarginInfo();l=r.target.anchorSpec;if(h&&r.widthModel.calculated){d=l.right(c)-m.width;d=p.adjustWidthAnchor(d,r);r.setWidth(d)}if(n&&r.heightModel.calculated){q=l.bottom(e)-m.height;q=p.adjustHeightAnchor(q,r);r.setHeight(q)}}return(b&o)===o},sanityCheck:function(c){var h=c.widthModel.shrinkWrap,e=c.heightModel.shrinkWrap,b=c.childItems,f,g,j,d,a;for(d=0,a=b.length;d<a;++d){j=b[d];g=j.target;f=g.anchorSpec;if(f){if(j.widthModel.calculated&&f.right){if(h){Ext.log({level:"warn",msg:"Right anchor on "+g.id+" in shrinkWrap width container"})}}if(j.heightModel.calculated&&f.bottom){if(e){Ext.log({level:"warn",msg:"Bottom anchor on "+g.id+" in shrinkWrap height container"})}}}}},anchorFactory:{offset:function(a){return function(b){return b+a}},ratio:function(a){return function(b){return Math.floor(b*a)}},standard:function(a){return function(b){return b-a}}},parseAnchor:function(c,f,b){if(c&&c!="none"){var d=this.anchorFactory,e;if(this.parseAnchorRE.test(c)){return d.standard(b-f)}if(c.indexOf("%")!=-1){return d.ratio(parseFloat(c.replace("%",""))*0.01)}e=parseInt(c,10);if(!isNaN(e)){return d.offset(e)}}return null},adjustWidthAnchor:function(b,a){return b},adjustHeightAnchor:function(b,a){return b},configureItem:function(f){var e=this,a=e.owner,d=f.anchor,b,c,g;e.callParent(arguments);if(!f.anchor&&f.items&&!Ext.isNumber(f.width)&&!(Ext.isIE6&&Ext.isStrict)){f.anchor=d=e.defaultAnchor}if(a.anchorSize){if(typeof a.anchorSize=="number"){c=a.anchorSize}else{c=a.anchorSize.width;g=a.anchorSize.height}}else{c=a.initialConfig.width;g=a.initialConfig.height}if(d){b=d.split(" ");f.anchorSpec={right:e.parseAnchor(b[0],f.initialConfig.width,c),bottom:e.parseAnchor(b[1],f.initialConfig.height,g)}}},sizePolicy:{$:{readsWidth:1,readsHeight:1,setsWidth:0,setsHeight:0},b:{readsWidth:1,readsHeight:0,setsWidth:0,setsHeight:1},r:{$:{readsWidth:0,readsHeight:1,setsWidth:1,setsHeight:0},b:{readsWidth:0,readsHeight:0,setsWidth:1,setsHeight:1}}},getItemSizePolicy:function(c){var e=c.anchorSpec,a="$",d=this.sizePolicy,b;if(e){b=this.owner.getSizeModel();if(e.right&&!b.width.shrinkWrap){d=d.r}if(e.bottom&&!b.height.shrinkWrap){a="b"}}return d[a]}});