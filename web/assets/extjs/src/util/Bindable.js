Ext.define("Ext.util.Bindable",{bindStore:function(b,c,a){a=a||"store";var d=this,e=d[a];if(!c&&e){d.onUnbindStore(e,c,a);if(b!==e&&e.autoDestroy){e.destroyStore()}else{d.unbindStoreListeners(e)}}if(b){b=Ext.data.StoreManager.lookup(b);d.bindStoreListeners(b);d.onBindStore(b,c,a)}d[a]=b||null;return d},getStore:function(){return this.store},unbindStoreListeners:function(a){var b=this.storeListeners;if(b){a.un(b)}},bindStoreListeners:function(a){var c=this,b=Ext.apply({},c.getStoreListeners(a));if(!b.scope){b.scope=c}c.storeListeners=b;a.on(b)},getStoreListeners:Ext.emptyFn,onUnbindStore:Ext.emptyFn,onBindStore:Ext.emptyFn});