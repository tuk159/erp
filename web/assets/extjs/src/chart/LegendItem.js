Ext.define("Ext.chart.LegendItem",{extend:"Ext.draw.CompositeSprite",requires:["Ext.chart.Shape"],hiddenSeries:false,label:undefined,x:0,y:0,zIndex:500,boldRe:/bold\s\d{1,}.*/i,constructor:function(a){this.callParent(arguments);this.createLegend(a)},createLegend:function(b){var d=this,c=d.series,a=b.yFieldIndex;d.label=d.createLabel(b);d.createSeriesMarkers(b);d.setAttributes({hidden:false},true);d.yFieldIndex=a;d.on("mouseover",d.onMouseOver,d);d.on("mouseout",d.onMouseOut,d);d.on("mousedown",d.onMouseDown,d);if(!c.visibleInLegend(a)){d.hiddenSeries=true;d.label.setAttributes({opacity:0.5},true)}d.updatePosition({x:0,y:0})},getLabelText:function(){var d=this,c=d.series,a=d.yFieldIndex;function b(e){var f=c[e];return(Ext.isArray(f)?f[a]:f)}return b("title")||b("yField")},createLabel:function(a){var c=this,b=c.legend;return c.add("label",c.surface.add({type:"text",x:20,y:0,zIndex:(c.zIndex||0)+2,fill:b.labelColor,font:b.labelFont,text:c.getLabelText(),style:{cursor:"pointer"}}))},createSeriesMarkers:function(c){var h=this,f=c.yFieldIndex,e=h.series,d=e.type,a=h.surface,g=h.zIndex;if(d==="line"||d==="scatter"){if(d==="line"){var i=Ext.apply(e.seriesStyle,e.style);h.drawLine(0.5,0.5,16.5,0.5,g,i,f)}if(e.showMarkers||d==="scatter"){var b=Ext.apply(e.markerStyle,e.markerConfig||{},{fill:e.getLegendColor(f)});h.drawMarker(8.5,0.5,g,b)}}else{h.drawFilledBox(12,12,g,f)}},drawLine:function(h,f,i,g,d,j,c){var e=this,a=e.surface,b=e.series;return e.add("line",a.add({type:"path",path:"M"+h+","+f+"L"+i+","+g,zIndex:(d||0)+2,"stroke-width":b.lineWidth,"stroke-linejoin":"round","stroke-dasharray":b.dash,stroke:j.stroke||b.getLegendColor(c)||"#000",style:{cursor:"pointer"}}))},drawMarker:function(b,g,f,e){var d=this,a=d.surface,c=d.series;return d.add("marker",Ext.chart.Shape[e.type](a,{fill:e.fill,x:b,y:g,zIndex:(f||0)+2,radius:e.radius||e.size,style:{cursor:"pointer"}}))},drawFilledBox:function(e,b,g,c){var f=this,a=f.surface,d=f.series;return f.add("box",a.add({type:"rect",zIndex:(g||0)+2,x:0,y:0,width:e,height:b,fill:d.getLegendColor(c),style:{cursor:"pointer"}}))},onMouseOver:function(){var a=this;a.label.setStyle({"font-weight":"bold"});a.series._index=a.yFieldIndex;a.series.highlightItem()},onMouseOut:function(){var b=this,a=b.legend,c=b.boldRe;b.label.setStyle({"font-weight":a.labelFont&&c.test(a.labelFont)?"bold":"normal"});b.series._index=b.yFieldIndex;b.series.unHighlightItem()},onMouseDown:function(){var b=this,a=b.yFieldIndex;if(!b.hiddenSeries){b.series.hideAll(a);b.label.setAttributes({opacity:0.5},true)}else{b.series.showAll(a);b.label.setAttributes({opacity:1},true)}b.hiddenSeries=!b.hiddenSeries;b.legend.chart.redraw()},updatePosition:function(c){var f=this,a=f.items,e=a.length,b=0,d;if(!c){c=f.legend}for(;b<e;b++){d=a[b];switch(d.type){case"text":d.setAttributes({x:20+c.x+f.x,y:c.y+f.y},true);break;case"rect":d.setAttributes({translate:{x:c.x+f.x,y:c.y+f.y-6}},true);break;default:d.setAttributes({translate:{x:c.x+f.x,y:c.y+f.y}},true)}}}});