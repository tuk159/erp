Ext.define("GatotKacaErp.module.GeneralSetup.controller.Department",{extend:"GatotKacaErp.controller.Base",views:["GatotKacaErp.module.GeneralSetup.view.Department"],store:"GatotKacaErp.module.GeneralSetup.store.Department",fmSelector:"formdepartment",init:function(){var b=this;var a=b.getStore(b.store);a.addListener("load",b.onStoreLoad,b);b.loadStore(a);a=b.getStore("GatotKacaErp.store.Department");a.setProxy({type:"ajax",api:{read:BASE_URL+"department/getlist"},actionMethods:{read:"POST"},reader:{type:"json",root:"data",successProperty:"success"}});a.load();b.control({"formdepartment button[action=reset]":{click:b.resetForm},"formdepartment button[action=save]":{click:b.save},"griddepartment  button[action=refresh]":{click:b.reloadStore},"griddepartment textfield[action=search]":{keypress:b.search},griddepartment:{itemclick:b.viewDetail,itemcontextmenu:b.showContextMenu}});b.callParent(arguments)},reloadStore:function(){this.loadStore(this.store)},search:function(d,a,c){var b=this;if(a.ENTER==a.getKey()){b.loadStore(b.store,{query:d.getValue()})}},viewDetail:function(d,c,g,a,b,f){var e=this.getForm(this.fmSelector);this.ajaxRequest(BASE_URL+"department/getbyid",{department_id:c.data.department_id},function(h){e.setValues(h.data[0]);e.findField("department_code").setReadOnly(true)})},save:function(b,a,e){var d=this;var c=b.up("form").getForm();if(c.isValid()){d.ajaxRequest(BASE_URL+"department/save",{department:Ext.JSON.encode(c.getValues())},function(f){d.showMessage({title:"SERVER MESSAGE",msg:f.msg,icon:Ext.MessageBox.INFO,buttons:Ext.MessageBox.OK});d.getStore(d.store).removeAll();d.reloadStore();d.resetForm()})}else{d.showMessage({title:"ERROR MESSAGE",msg:"Form is not valid",icon:Ext.MessageBox.WARNING,buttons:Ext.MessageBox.OK})}},resetForm:function(){var a=this.getForm(this.fmSelector);a.reset();a.findField("department_code").setReadOnly(false)}});