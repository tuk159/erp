Ext.define("Ext.rtl.layout.container.Box",{override:"Ext.layout.container.Box",initLayout:function(){var a=this;if(a.owner.getHierarchyState().rtl){a.names=Ext.Object.chain(a.names);Ext.apply(a.names,a.rtlNames)}a.callParent(arguments)},getRenderData:function(){var a=this.callParent();if(this.owner.getHierarchyState().rtl){a.targetElCls=(a.targetElCls||"")+" "+Ext.baseCSSPrefix+"rtl"}return a}});