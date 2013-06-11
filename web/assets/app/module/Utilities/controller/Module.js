Ext.define("GatotKacaErp.module.Utilities.controller.Module",{extend:"GatotKacaErp.controller.Base",views:["GatotKacaErp.module.Utilities.view.Module"],store:"GatotKacaErp.module.Utilities.store.Module",fmSelector:"formmodule",init:function(){var b=this;var a=b.getStore(b.store);a.addListener("load",b.onStoreLoad,b);b.loadStore(a,{status:"all"});b.getStore("GatotKacaErp.store.Module").load();b.control({"gridmodule textfield[action=search]":{keypress:b.search},"gridmodule button[action=refresh]":{click:b.reloadStore},gridmodule:{itemclick:b.gridSelect},"formmodule button[action=reset]":{click:b.resetForm},"formmodule button[action=save]":{click:b.save}});b.callParent(arguments)},reloadStore:function(b,a,c){this.loadStore(this.store,{status:"all"})},search:function(d,a,c){var b=this;if(a.ENTER==a.getKey()){b.loadStore(b.store,{query:d.getValue(),status:"all"})}},gridSelect:function(d,c,g,a,b,f){var e=this.getForm(this.fmSelector);this.ajaxRequest(BASE_URL+"utilities/module/getbyid",{module_id:c.data.module_id},function(h){e.setValues(h.data[0])})},resetForm:function(){var a=this.getForm(this.fmSelector);a.reset()},save:function(b,a,e){var d=this;var c=b.up("form").getForm();if(c.isValid()){d.ajaxRequest(BASE_URL+"utilities/module/save",{module:Ext.JSON.encode(c.getValues())},function(f){d.showMessage({title:"SERVER MESSAGE",msg:f.msg,icon:Ext.MessageBox.INFO,buttons:Ext.MessageBox.OK});d.getStore(d.store).removeAll();d.reloadStore();d.resetForm()})}else{d.showMessage({title:"ERROR MESSAGE",msg:"Form is not valid",icon:Ext.MessageBox.WARNING,buttons:Ext.MessageBox.OK})}}});