Ext.define("Ext.grid.ViewDropZone",{extend:"Ext.view.DropZone",indicatorHtml:'<div class="'+Ext.baseCSSPrefix+'grid-drop-indicator-left"></div><div class="'+Ext.baseCSSPrefix+'grid-drop-indicator-right"></div>',indicatorCls:Ext.baseCSSPrefix+"grid-drop-indicator",handleNodeDrop:function(b,d,e){var h=this.view,j=h.getStore(),g,a,c,f;if(b.copy){a=b.records;b.records=[];for(c=0,f=a.length;c<f;c++){b.records.push(a[c].copy())}}else{b.view.store.remove(b.records,b.view===h)}if(d&&e){g=j.indexOf(d);if(e!=="before"){g++}j.insert(g,b.records)}else{j.add(b.records)}h.getSelectionModel().select(b.records)}});