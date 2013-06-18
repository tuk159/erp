Ext.define("Ext.layout.container.Border",{extend:"Ext.layout.container.Container",alias:"layout.border",alternateClassName:"Ext.layout.BorderLayout",requires:["Ext.resizer.BorderSplitter","Ext.fx.Anim","Ext.layout.container.border.Region"],targetCls:Ext.baseCSSPrefix+"border-layout-ct",itemCls:[Ext.baseCSSPrefix+"border-item",Ext.baseCSSPrefix+"box-item"],type:"border",isBorderLayout:true,padding:undefined,percentageRe:/(\d+)%/,horzMarginProp:"left",padOnContainerProp:"left",padNotOnContainerProp:"right",axisProps:{horz:{borderBegin:"west",borderEnd:"east",horizontal:true,posProp:"x",sizeProp:"width",sizePropCap:"Width"},vert:{borderBegin:"north",borderEnd:"south",horizontal:false,posProp:"y",sizeProp:"height",sizePropCap:"Height"}},centerRegion:null,manageMargins:true,panelCollapseAnimate:true,panelCollapseMode:"placeholder",regionWeights:{north:20,south:10,center:0,west:-10,east:-20},beginAxis:function(l,b,v){var t=this,c=t.axisProps[v],q=!c.horizontal,k=c.sizeProp,o=0,a=l.childItems,f=a.length,s,p,n,g,r,e,j,m,d,u,h;for(p=0;p<f;++p){n=a[p];r=n.target;n.layoutPos={};if(r.region){n.region=e=r.region;n.isCenter=r.isCenter;n.isHorz=r.isHorz;n.isVert=r.isVert;n.weight=r.weight||t.regionWeights[e]||0;b[r.id]=n;if(r.isCenter){s=n;g=r.flex;l.centerRegion=s;continue}if(q!==n.isVert){continue}n.reverseWeighting=(e==c.borderEnd);m=r[k];d=typeof m;if(!r.collapsed){if(d=="string"&&(j=t.percentageRe.exec(m))){n.percentage=parseInt(j[1],10)}else{if(r.flex){o+=n.flex=r.flex}}}}}if(s){u=s.target;if((h=u.placeholderFor)){if(!g&&q===h.collapsedVertical()){g=0;s.collapseAxis=v}}else{if(u.collapsed&&(q===u.collapsedVertical())){g=0;s.collapseAxis=v}}}if(g==null){g=1}o+=g;return Ext.apply({before:q?"top":"left",totalFlex:o},c)},beginLayout:function(d){var k=this,j=k.getLayoutItems(),e=k.padding,l=typeof e,o=false,p,n,b,g,f,a,c,h,m;if(e){if(l=="string"||l=="number"){e=Ext.util.Format.parseBox(e)}}else{e=d.getEl("getTargetEl").getPaddingInfo();o=true}d.outerPad=e;d.padOnContainer=o;for(g=0,b=j.length;g<b;++g){n=j[g];a=k.getSplitterTarget(n);if(a){c=undefined;h=!!n.hidden;if(!a.split){if(a.isCollapsingOrExpanding){c=!!a.collapsed}}else{if(h!==a.hidden){c=!a.hidden}}if(c){n.show()}else{if(c===false){n.hide()}}}}k.callParent(arguments);j=d.childItems;b=j.length;f={};d.borderAxisHorz=k.beginAxis(d,f,"horz");d.borderAxisVert=k.beginAxis(d,f,"vert");for(g=0;g<b;++g){p=j[g];a=k.getSplitterTarget(p.target);if(a){m=f[a.id];if(!m){m=d.getEl(a.el,k);m.region=a.region}p.collapseTarget=a=m;p.weight=a.weight;p.reverseWeighting=a.reverseWeighting;a.splitter=p;p.isHorz=a.isHorz;p.isVert=a.isVert}}k.sortWeightedItems(j,"reverseWeighting");k.setupSplitterNeighbors(j)},calculate:function(d){var l=this,a=l.getContainerSize(d),h=d.childItems,c=h.length,b=d.borderAxisHorz,j=d.borderAxisVert,e=d.outerPad,n=d.padOnContainer,g,p,k,o,m,f;b.begin=e[l.padOnContainerProp];j.begin=e.top;m=b.end=b.flexSpace=a.width+(n?e[l.padOnContainerProp]:-e[l.padNotOnContainerProp]);f=j.end=j.flexSpace=a.height+(n?e.top:-e.bottom);for(g=0;g<c;++g){p=h[g];k=p.getMarginInfo();if(p.isHorz||p.isCenter){b.addUnflexed(k.width);m-=k.width}if(p.isVert||p.isCenter){j.addUnflexed(k.height);f-=k.height}if(!p.flex&&!p.percentage){if(p.isHorz||(p.isCenter&&p.collapseAxis==="horz")){o=p.getProp("width");b.addUnflexed(o);if(p.collapseTarget){m-=o}}else{if(p.isVert||(p.isCenter&&p.collapseAxis==="vert")){o=p.getProp("height");j.addUnflexed(o);if(p.collapseTarget){f-=o}}}}}for(g=0;g<c;++g){p=h[g];k=p.getMarginInfo();if(p.percentage){if(p.isHorz){o=Math.ceil(m*p.percentage/100);o=p.setWidth(o);b.addUnflexed(o)}else{if(p.isVert){o=Math.ceil(f*p.percentage/100);o=p.setHeight(o);j.addUnflexed(o)}}}}for(g=0;g<c;++g){p=h[g];if(!p.isCenter){l.calculateChildAxis(p,b);l.calculateChildAxis(p,j)}}if(l.finishAxis(d,j)+l.finishAxis(d,b)<2){l.done=false}else{l.finishPositions(h)}},calculateChildAxis:function(k,c){var a=k.collapseTarget,g="set"+c.sizePropCap,e=c.sizeProp,d=k.getMarginInfo()[e],i,b,f,h,j;if(a){i=a.region}else{i=k.region;f=k.flex}b=i==c.borderBegin;if(!b&&i!=c.borderEnd){k[g](c.end-c.begin-d);h=c.begin}else{if(f){j=Math.ceil(c.flexSpace*(f/c.totalFlex));j=k[g](j)}else{if(k.percentage){j=k.peek(e)}else{j=k.getProp(e)}}j+=d;if(b){h=c.begin;c.begin+=j}else{c.end=h=c.end-j}}k.layoutPos[c.posProp]=h},finishAxis:function(d,c){var b=c.end-c.begin,a=d.centerRegion;if(a){a["set"+c.sizePropCap](b-a.getMarginInfo()[c.sizeProp]);a.layoutPos[c.posProp]=c.begin}return Ext.isNumber(b)?1:0},finishPositions:function(e){var c=e.length,b,a,d=this.horzMarginProp;for(b=0;b<c;++b){a=e[b];a.setProp("x",a.layoutPos.x+a.marginInfo[d]);a.setProp("y",a.layoutPos.y+a.marginInfo.top)}},getLayoutItems:function(){var a=this.owner,e=(a&&a.items&&a.items.items)||[],d=e.length,b=[],c=0,f,g;for(;c<d;c++){f=e[c];g=f.placeholderFor;if(f.hidden||((!f.floated||f.isCollapsingOrExpanding===2)&&!(g&&g.isCollapsingOrExpanding===2))){b.push(f)}}return b},getPlaceholder:function(a){return a.getPlaceholder&&a.getPlaceholder()},getSplitterTarget:function(b){var a=b.collapseTarget;if(a&&a.collapsed){return a.placeholder||a}return a},isItemBoxParent:function(a){return true},isItemShrinkWrap:function(a){return true},insertSplitter:function(d,c,f,b){var g=d.region,e=Ext.apply({xtype:"bordersplitter",collapseTarget:d,id:d.id+"-splitter",hidden:f,canResize:d.splitterResize!==false,splitterFor:d},b),a=c+((g==="south"||g==="east")?0:1);if(d.collapseMode==="mini"){e.collapsedCls=d.collapsedCls}d.splitter=this.owner.add(a,e)},onAdd:function(e,b){var d=this,h=e.placeholderFor,g=e.region,c,f,a;d.callParent(arguments);if(g){Ext.apply(e,d.regionFlags[g]);if(e.initBorderRegion){e.initBorderRegion()}if(g==="center"){if(d.centerRegion){Ext.Error.raise("Cannot have multiple center regions in a BorderLayout.")}d.centerRegion=e}else{c=e.split;f=!!e.hidden;if(typeof c==="object"){a=c;c=true}if((e.isHorz||e.isVert)&&(c||e.collapseMode=="mini")){d.insertSplitter(e,b,f||!c,a)}}if(!e.hasOwnProperty("collapseMode")){e.collapseMode=d.panelCollapseMode}if(!e.hasOwnProperty("animCollapse")){if(e.collapseMode!=="placeholder"){e.animCollapse=false}else{e.animCollapse=d.panelCollapseAnimate}}}else{if(h){Ext.apply(e,d.regionFlags[h.region]);e.region=h.region;e.weight=h.weight}}},onDestroy:function(){this.centerRegion=null;this.callParent()},onRemove:function(b){var a=this,d=b.region,c=b.splitter;if(d){if(b.isCenter){a.centerRegion=null}delete b.isCenter;delete b.isHorz;delete b.isVert;if(c){a.owner.doRemove(c,true);delete b.splitter}}a.callParent(arguments)},regionMeta:{center:{splitterDelta:0},north:{splitterDelta:1},south:{splitterDelta:-1},west:{splitterDelta:1},east:{splitterDelta:-1}},regionFlags:{center:{isCenter:true,isHorz:false,isVert:false},north:{isCenter:false,isHorz:false,isVert:true,collapseDirection:"top"},south:{isCenter:false,isHorz:false,isVert:true,collapseDirection:"bottom"},west:{isCenter:false,isHorz:true,isVert:false,collapseDirection:"left"},east:{isCenter:false,isHorz:true,isVert:false,collapseDirection:"right"}},setupSplitterNeighbors:function(l){var o={},e=l.length,n=this.touchedRegions,g,f,a,k,d,h,m,b,c;for(g=0;g<e;++g){h=l[g].target;m=h.region;if(h.isCenter){a=h}else{if(m){c=n[m];for(f=0,k=c.length;f<k;++f){d=o[c[f]];if(d){d.neighbors.push(h)}}if(h.placeholderFor){b=h.placeholderFor.splitter}else{b=h.splitter}if(b){b.neighbors=[]}o[m]=b}}}if(a){c=n.center;for(f=0,k=c.length;f<k;++f){d=o[c[f]];if(d){d.neighbors.push(a)}}}},touchedRegions:{center:["north","south","east","west"],north:["north","east","west"],south:["south","east","west"],east:["east","north","south"],west:["west","north","south"]},sizePolicies:{vert:{readsWidth:0,readsHeight:1,setsWidth:1,setsHeight:0},horz:{readsWidth:1,readsHeight:0,setsWidth:0,setsHeight:1},flexAll:{readsWidth:0,readsHeight:0,setsWidth:1,setsHeight:1}},getItemSizePolicy:function(e){var d=this,a=this.sizePolicies,c,b,f,g;if(e.isCenter){g=e.placeholderFor;if(g){if(g.collapsedVertical()){return a.vert}return a.horz}if(e.collapsed){if(e.collapsedVertical()){return a.vert}return a.horz}return a.flexAll}c=e.collapseTarget;if(c){return c.isVert?a.vert:a.horz}if(e.region){if(e.isVert){b=e.height;f=a.vert}else{b=e.width;f=a.horz}if(e.flex||(typeof b=="string"&&d.percentageRe.test(b))){return a.flexAll}return f}return d.autoSizePolicy}},function(){var a={addUnflexed:function(c){this.flexSpace=Math.max(this.flexSpace-c,0)}},b=this.prototype.axisProps;Ext.apply(b.horz,a);Ext.apply(b.vert,a)});