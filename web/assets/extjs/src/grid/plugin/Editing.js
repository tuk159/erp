Ext.define("Ext.grid.plugin.Editing",{alias:"editing.editing",extend:"Ext.AbstractPlugin",requires:["Ext.grid.column.Column","Ext.util.KeyNav"],mixins:{observable:"Ext.util.Observable"},clicksToEdit:2,triggerEvent:undefined,relayedEvents:["beforeedit","edit","validateedit","canceledit"],defaultFieldXType:"textfield",editStyle:"",constructor:function(a){var b=this;b.addEvents("beforeedit","edit","validateedit","canceledit");b.callParent(arguments);b.mixins.observable.constructor.call(b);b.on("edit",function(c,d){b.fireEvent("afteredit",c,d)})},init:function(a){var b=this;b.grid=a;b.view=a.view;b.initEvents();b.mon(a,{reconfigure:b.onReconfigure,scope:b,beforerender:{fn:b.onReconfigure,single:true,scope:b}});a.relayEvents(b,b.relayedEvents);if(b.grid.ownerLockable){b.grid.ownerLockable.relayEvents(b,b.relayedEvents)}a.isEditable=true;a.editingPlugin=a.view.editingPlugin=b},onReconfigure:function(){var a=this.grid;a=a.ownerLockable?a.ownerLockable:a;this.initFieldAccessors(a.getView().getGridColumns())},destroy:function(){var b=this,a=b.grid;Ext.destroy(b.keyNav);b.clearListeners();if(a){b.removeFieldAccessors(a.columnManager.getColumns());a.editingPlugin=a.view.editingPlugin=b.grid=b.view=b.editor=b.keyNav=null}},getEditStyle:function(){return this.editStyle},initFieldAccessors:function(a){if(a.isGroupHeader){a=a.getGridColumns()}else{if(!Ext.isArray(a)){a=[a]}}var d=this,f,e=a.length,b;for(f=0;f<e;f++){b=a[f];if(!b.getEditor){b.getEditor=function(c,g){return d.getColumnField(this,g)}}if(!b.hasEditor){b.hasEditor=function(){return d.hasColumnField(this)}}if(!b.setEditor){b.setEditor=function(c){d.setColumnField(this,c)}}}},removeFieldAccessors:function(a){if(a.isGroupHeader){a=a.getGridColumns()}else{if(!Ext.isArray(a)){a=[a]}}var e,d=a.length,b;for(e=0;e<d;e++){b=a[e];b.getEditor=b.hasEditor=b.setEditor=null}},getColumnField:function(b,a){var c=b.field;if(!(c&&c.isFormField)){c=b.field=this.createColumnField(b,a)}return c},hasColumnField:function(a){return !!a.field},setColumnField:function(a,b){a.field=b;a.field=this.createColumnField(a)},createColumnField:function(b,a){var c=b.field;if(!c&&b.editor){c=b.editor;b.editor=null}if(!c&&a){c=a}if(c){if(c.isFormField){c.column=b}else{if(Ext.isString(c)){c={name:b.dataIndex,xtype:c,column:b}}else{c=Ext.apply({name:b.dataIndex,column:b},c)}c=Ext.ComponentManager.create(c,this.defaultFieldXType)}b.field=c}return c},initEvents:function(){var a=this;a.initEditTriggers();a.initCancelTriggers()},initCancelTriggers:Ext.emptyFn,initEditTriggers:function(){var b=this,a=b.view;if(b.triggerEvent=="cellfocus"){b.mon(a,"cellfocus",b.onCellFocus,b)}else{if(b.triggerEvent=="rowfocus"){b.mon(a,"rowfocus",b.onRowFocus,b)}else{if(a.getSelectionModel().isCellModel){a.onCellFocus=Ext.Function.bind(b.beforeViewCellFocus,b)}b.mon(a,b.triggerEvent||("cell"+(b.clicksToEdit===1?"click":"dblclick")),b.onCellClick,b)}}b.initAddRemoveHeaderEvents();a.on("render",b.initKeyNavHeaderEvents,b,{single:true})},beforeViewCellFocus:function(a){if(this.view.selModel.keyNavigation||!this.editing||!this.isCellEditable||!this.isCellEditable(a.row,a.columnHeader)){this.view.focusCell.apply(this.view,arguments)}},onRowFocus:function(a,c,b){this.startEdit(c,0)},onCellFocus:function(c,b,a){this.startEdit(a.row,a.column)},onCellClick:function(c,a,h,b,g,d,f){if(!c.expanderSelector||!f.getTarget(c.expanderSelector)){this.startEdit(b,c.ownerCt.columnManager.getHeaderAtIndex(h))}},initAddRemoveHeaderEvents:function(){var a=this;a.mon(a.grid.headerCt,{scope:a,add:a.onColumnAdd,remove:a.onColumnRemove,columnmove:a.onColumnMove})},initKeyNavHeaderEvents:function(){var a=this;a.keyNav=Ext.create("Ext.util.KeyNav",a.view.el,{enter:a.onEnterKey,esc:a.onEscKey,scope:a})},onColumnAdd:function(a,b){this.initFieldAccessors(b)},onColumnRemove:function(a,b){this.removeFieldAccessors(b)},onColumnMove:function(d,b,a,c){this.initFieldAccessors(b)},onEnterKey:function(g){var d=this,c=d.grid,b=c.getSelectionModel(),a,h,f;if(b.getCurrentPosition&&(h=b.getCurrentPosition())){a=h.record;f=h.columnHeader}else{a=b.getLastSelected();f=c.columnManager.getHeaderAtIndex(0)}if(a&&f){d.startEdit(a,f)}},onEscKey:function(a){return this.cancelEdit()},beforeEdit:Ext.emptyFn,startEdit:function(b,e){var d=this,c,a=d.grid.lockable?d.grid:d.view;if(!a.componentLayoutCounter){a.on({boxready:Ext.Function.bind(d.startEdit,d,[b,e]),single:true});return false}if(d.grid.collapsed||!d.grid.view.isVisible(true)){return false}c=d.getEditingContext(b,e);if(c==null){return false}if(!d.preventBeforeCheck){if(d.beforeEdit(c)===false||d.fireEvent("beforeedit",d,c)===false||c.cancel){return false}}d.editing=true;return c},getEditingContext:function(b,f){var e=this,c=e.grid,a=e.view,g=a.getNode(b,true),d,h;if(!g){return}f=c.columnManager.getVisibleHeaderClosestToIndex(Ext.isNumber(f)?f:f.getVisibleIndex());if(!f){return}h=f.getVisibleIndex();if(Ext.isNumber(b)){d=b;b=a.getRecord(g)}else{d=a.indexOf(g)}if(!b){return}return{grid:c,view:a,store:a.dataSource,record:b,field:f.dataIndex,value:b.get(f.dataIndex),row:g,column:f,rowIdx:d,colIdx:h}},cancelEdit:function(){var a=this;a.editing=false;a.fireEvent("canceledit",a,a.context)},completeEdit:function(){var a=this;if(a.editing&&a.validateEdit()){a.fireEvent("edit",a,a.context)}a.context=null;a.editing=false},validateEdit:function(){var b=this,a=b.context;return b.fireEvent("validateedit",b,a)!==false&&!a.cancel}});