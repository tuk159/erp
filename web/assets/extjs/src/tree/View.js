Ext.define("Ext.tree.View",{extend:"Ext.view.Table",alias:"widget.treeview",requires:["Ext.data.NodeStore"],isTreeView:true,loadingCls:Ext.baseCSSPrefix+"grid-tree-loading",expandedCls:Ext.baseCSSPrefix+"grid-tree-node-expanded",leafCls:Ext.baseCSSPrefix+"grid-tree-node-leaf",expanderSelector:"."+Ext.baseCSSPrefix+"tree-expander",checkboxSelector:"."+Ext.baseCSSPrefix+"tree-checkbox",expanderIconOverCls:Ext.baseCSSPrefix+"tree-expander-over",nodeAnimWrapCls:Ext.baseCSSPrefix+"tree-animator-wrap",blockRefresh:true,loadMask:false,rootVisible:true,deferInitialRefresh:false,expandDuration:250,collapseDuration:250,toggleOnDblClick:true,stripeRows:false,uiFields:["expanded","loaded","checked","expandable","leaf","icon","iconCls","loading","qtip","qtitle"],treeRowTpl:["{%","this.processRowValues(values);","this.nextTpl.applyOut(values, out, parent);",'delete values.rowAttr["data-qtip"];','delete values.rowAttr["data-qtitle"];',"%}",{priority:10,processRowValues:function(d){var b=d.record,a=d.view,e=b.get("qtip"),c=b.get("qttle");d.rowAttr={};if(e){d.rowAttr["data-qtip"]=e}if(c){d.rowAttr["data-qtitle"]=c}if(b.isExpanded()){d.rowClasses.push(a.expandedCls)}if(b.isLeaf()){d.rowClasses.push(a.leafCls)}if(b.isLoading()){d.rowClasses.push(a.loadingCls)}}}],initComponent:function(){var b=this,c=b.panel.getStore(),a=b.store;if(b.initialConfig.animate===undefined){b.animate=Ext.enableFx}if(!a||a===c){b.store=a=new Ext.data.NodeStore({treeStore:c,recursive:true,rootVisible:b.rootVisible})}if(b.node){b.setRootNode(b.node)}b.animQueue={};b.animWraps={};b.addEvents("afteritemexpand","afteritemcollapse","nodedragover");b.callParent(arguments);b.addRowTpl(Ext.XTemplate.getTpl(b,"treeRowTpl"))},onBeforeFill:function(b,a){this.store.suspendEvents()},onFillComplete:function(e,d,b){var c=this,a=c.store,f=a.indexOf(b[0]);a.resumeEvents();d.triggerUIUpdate();if(!b.length||f===-1){return}c.onAdd(c.store,b,f);c.refreshPartner()},onBeforeSort:function(){this.store.suspendEvents()},onSort:function(a){if(a.isStore){this.store.resumeEvents();this.refresh();this.refreshPartner()}},refreshPartner:function(){var a=this.lockingPartner;if(a){a.refresh()}},getMaskStore:function(){return this.panel.getStore()},afterRender:function(){var a=this;a.callParent(arguments);a.el.on({scope:a,delegate:a.expanderSelector,mouseover:a.onExpanderMouseOver,mouseout:a.onExpanderMouseOut,click:{delegate:a.checkboxSelector,fn:a.onCheckboxChange,scope:a}})},afterComponentLayout:function(){this.callParent(arguments);var a=this.stretcher;if(a){a.setWidth((this.getWidth()-Ext.getScrollbarSize().width))}},processUIEvent:function(a){if(a.getTarget("."+this.nodeAnimWrapCls,this.el)){return false}return this.callParent(arguments)},onClear:function(){this.store.removeAll()},setRootNode:function(b){var a=this;a.store.setNode(b);a.node=b},onCheckboxChange:function(d,a){var c=this,b=d.getTarget(c.getItemSelector(),c.getTargetEl());if(b){c.onCheckChange(c.getRecord(b))}},onCheckChange:function(a){var b=a.get("checked");if(Ext.isBoolean(b)){b=!b;a.set("checked",b);this.fireEvent("checkchange",a,b)}},getChecked:function(){var a=[];this.node.cascadeBy(function(b){if(b.get("checked")){a.push(b)}});return a},isItemChecked:function(a){return a.get("checked")},createAnimWrap:function(a,b){var f=this,e=f.getNode(a),d,c,g=[];f.renderColumnSizer(g);c=Ext.get(e);d=c.insertSibling({tag:"tr",html:['<td colspan="'+f.panel.headerCt.getColumnCount()+'">','<div class="'+f.nodeAnimWrapCls+'">','<table class="'+Ext.baseCSSPrefix+f.id+"-table "+Ext.baseCSSPrefix+'grid-table" style="border:0" cellspacing="0" cellpadding="0">',g.join(""),"<tbody></tbody></table>","</div>","</td>"].join("")},"after");return{record:a,node:e,el:d,expanding:false,collapsing:false,animating:false,animateEl:d.down("div"),targetEl:d.down("tbody")}},getAnimWrap:function(d,a){if(!this.animate){return null}var b=this.animWraps,c=b[d.internalId];if(a!==false){while(!c&&d){d=d.parentNode;if(d){c=b[d.internalId]}}}return c},doAdd:function(c,g){var h=this,a=h.bufferRender(c,g,true),e=c[0],i=e.parentNode,j=h.all,l,d=h.getAnimWrap(i),k,b,f;if(!d||!d.expanding){return h.callParent(arguments)}i=d.record;k=d.targetEl;b=k.dom.childNodes;f=b.length;l=g-h.indexInStore(i)-1;if(!f||l>=f){k.appendChild(a)}else{Ext.fly(b[l]).insertSibling(a,"before",true)}j.insert(g,a);if(d.isAnimating){h.onExpand(i)}},onRemove:function(f,a,b){var d=this,e,c;if(d.viewReady){e=d.store.getCount()===0;if(e){d.refresh()}else{for(c=b.length-1;c>=0;--c){d.doRemove(a[c],b[c])}}if(d.hasListeners.itemremove){for(c=b.length-1;c>=0;--c){d.fireEvent("itemremove",a[c],b[c])}}}},doRemove:function(a,c){var g=this,d=g.all,b=g.getAnimWrap(a),f=d.item(c),e=f?f.dom:null;if(!e||!b||!b.collapsing){return g.callParent(arguments)}b.targetEl.dom.insertBefore(e,b.targetEl.dom.firstChild);d.removeElement(c)},onBeforeExpand:function(d,b,c){var e=this,a;if(e.rendered&&e.all.getCount()&&e.animate){if(e.getNode(d)){a=e.getAnimWrap(d,false);if(!a){a=e.animWraps[d.internalId]=e.createAnimWrap(d);a.animateEl.setHeight(0)}else{if(a.collapsing){a.targetEl.select(e.itemSelector).remove()}}a.expanding=true;a.collapsing=false}}},onExpand:function(i){var h=this,f=h.animQueue,a=i.getId(),c=h.getNode(i),g=c?h.indexOf(c):-1,e,b,j,d=Ext.isIEQuirks?1:0;if(h.singleExpand){h.ensureSingleExpand(i)}if(g===-1){return}e=h.getAnimWrap(i,false);if(!e){i.isExpandingOrCollapsing=false;h.fireEvent("afteritemexpand",i,g,c);h.refreshSize();return}b=e.animateEl;j=e.targetEl;b.stopAnimation();f[a]=true;b.dom.style.height=d+"px";b.animate({from:{height:d},to:{height:j.getHeight()},duration:h.expandDuration,listeners:{afteranimate:function(){var k=j.query(h.itemSelector);if(k.length){e.el.insertSibling(k,"before",true)}e.el.remove();h.refreshSize();delete h.animWraps[e.record.internalId];delete f[a]}},callback:function(){i.isExpandingOrCollapsing=false;h.fireEvent("afteritemexpand",i,g,c)}});e.isAnimating=true},onBeforeCollapse:function(e,b,c,g,d){var f=this,a;if(f.rendered&&f.all.getCount()){if(f.animate){if(Ext.Array.contains(e.stores,f.store)){a=f.getAnimWrap(e);if(!a){a=f.animWraps[e.internalId]=f.createAnimWrap(e,c)}else{if(a.expanding){a.targetEl.select(this.itemSelector).remove()}}a.expanding=false;a.collapsing=true;a.callback=g;a.scope=d}}else{f.onCollapseCallback=g;f.onCollapseScope=d}}},onCollapse:function(d){var f=this,a=f.animQueue,h=d.getId(),e=f.getNode(d),c=e?f.indexOf(e):-1,b=f.getAnimWrap(d),g;if(!f.all.getCount()||!Ext.Array.contains(d.stores,f.store)){return}if(!b){d.isExpandingOrCollapsing=false;f.fireEvent("afteritemcollapse",d,c,e);f.refreshSize();Ext.callback(f.onCollapseCallback,f.onCollapseScope);f.onCollapseCallback=f.onCollapseScope=null;return}g=b.animateEl;a[h]=true;g.stopAnimation();g.animate({to:{height:Ext.isIEQuirks?1:0},duration:f.collapseDuration,listeners:{afteranimate:function(){b.el.remove();f.refreshSize();delete f.animWraps[b.record.internalId];delete a[h]}},callback:function(){d.isExpandingOrCollapsing=false;f.fireEvent("afteritemcollapse",d,c,e);Ext.callback(b.callback,b.scope);b.callback=b.scope=null}});b.isAnimating=true},isAnimating:function(a){return !!this.animQueue[a.getId()]},expand:function(d,c,g,e){var f=this,b=!!f.animate,a;if(!b||!d.isExpandingOrCollapsing){if(!d.isLeaf()){d.isExpandingOrCollapsing=b}Ext.suspendLayouts();a=d.expand(c,g,e);Ext.resumeLayouts(true);return a}},collapse:function(c,b,f,d){var e=this,a=!!e.animate;if(!a||!c.isExpandingOrCollapsing){if(!c.isLeaf()){c.isExpandingOrCollapsing=a}return c.collapse(b,f,d)}},toggle:function(b,a,d,c){if(b.isExpanded()){this.collapse(b,a,d,c)}else{this.expand(b,a,d,c)}},onItemDblClick:function(a,e,c){var d=this,b=d.editingPlugin;d.callParent(arguments);if(d.toggleOnDblClick&&a.isExpandable()&&!(b&&b.clicksToEdit===2)){d.toggle(a)}},onBeforeItemMouseDown:function(a,c,b,d){if(d.getTarget(this.expanderSelector,c)){return false}return this.callParent(arguments)},onItemClick:function(a,c,b,d){if(d.getTarget(this.expanderSelector,c)&&a.isExpandable()){this.toggle(a,d.ctrlKey);return false}return this.callParent(arguments)},onExpanderMouseOver:function(b,a){b.getTarget(this.cellSelector,10,true).addCls(this.expanderIconOverCls)},onExpanderMouseOut:function(b,a){b.getTarget(this.cellSelector,10,true).removeCls(this.expanderIconOverCls)},getStoreListeners:function(){var b=this,a=b.callParent(arguments);return Ext.apply(a,{beforeexpand:b.onBeforeExpand,expand:b.onExpand,beforecollapse:b.onBeforeCollapse,collapse:b.onCollapse,write:b.onStoreWrite,datachanged:b.onStoreDataChanged})},onBindStore:function(){var a=this,b=a.getTreeStore();a.callParent(arguments);a.mon(b,{scope:a,beforefill:a.onBeforeFill,fillcomplete:a.onFillComplete});if(!b.remoteSort){a.mon(b,{scope:a,beforesort:a.onBeforeSort,sort:a.onSort})}},onUnbindStore:function(){var a=this,b=a.getTreeStore();a.callParent(arguments);a.mun(b,{scope:a,beforefill:a.onBeforeFill,fillcomplete:a.onFillComplete});if(!b.remoteSort){a.mun(b,{scope:a,beforesort:a.onBeforeSort,sort:a.onSort})}},getTreeStore:function(){return this.panel.store},ensureSingleExpand:function(b){var a=b.parentNode;if(a){a.eachChild(function(c){if(c!==b&&c.isExpanded()){c.collapse()}})}},shouldUpdateCell:function(b,e,d){if(d){var c=0,a=d.length;for(;c<a;++c){if(Ext.Array.contains(this.uiFields,d[c])){return true}}}return this.callParent(arguments)},onStoreWrite:function(b,a){var c=this.panel.store;c.fireEvent("write",c,a)},onStoreDataChanged:function(b,a){var c=this.panel.store;c.fireEvent("datachanged",c)}});