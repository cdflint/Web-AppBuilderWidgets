//>>built
require({cache:{"url:builder/plugins/widget-config/GroupSettingPage.html":'\x3cdiv\x3e\r\n  \x3cdiv class\x3d"label-div"\x3e\r\n    \x3cspan\x3e${nls.label}\x3c/span\x3e\r\n    \x3cinput class\x3d"jimu-input" data-dojo-attach-point\x3d"labelNode"\x3e\x3c/input\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e\r\n'}});
define("dojo/_base/declare dojo/dom-attr dojo/topic dijit/_WidgetBase dijit/_TemplatedMixin dojo/text!./GroupSettingPage.html".split(" "),function(a,b,c,d,e,f){return a([d,e],{templateString:f,baseClass:"group-setting-page",startup:function(){this.labelNode.value=this.setting.label},onOk:function(){this.setting.label=b.get(this.labelNode,"value");c.publish("groupChanged",this.setting);this.popup.close()},onCancel:function(){}})});