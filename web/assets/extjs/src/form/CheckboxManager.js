Ext.define("Ext.form.CheckboxManager",{extend:"Ext.util.MixedCollection",singleton:true,getByName:function(a,b){return this.filterBy(function(c){return c.name==a&&c.getFormId()==b})}});