//>>built
require({cache:{"url:builder/plugins/widget-config/WidgetChoosePage.html":'\x3cdiv class\x3d"widget-choose-page"\x3e\r\n  \r\n  \x3cdiv class\x3d"section search" data-dojo-attach-point\x3d"searchSectionNode"\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"searchInputNode"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"list widget-list" data-dojo-attach-point\x3d"widgetListNode"\x3e\x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e'}});
define("dojo/_base/declare dojo/_base/lang dojo/_base/html dojo/_base/array dojo/topic dojo/on dojo/Deferred dojo/promise/all dojo/query dojo/NodeList-dom dijit/_WidgetBase dijit/_TemplatedMixin dojo/text!./WidgetChoosePage.html jimu/dijit/Search jimu/WidgetManager jimu/dijit/LoadingShelter jimu/dijit/Message jimu/utils builder/serviceUtils".split(" "),function(n,d,b,f,p,h,q,r,k,y,s,t,u,v,w,x,l,e,m){return n([s,t],{templateString:u,postMixInProperties:function(){this.widgetManager=w.getInstance()},
startup:function(){this.inherited(arguments);this.searchDijit=new v({placeholder:this.nls.widgetName,onSearch:d.hitch(this,this.searchWidget),searchWhenInput:!0},this.searchInputNode);this._getWidgets();this.own(h(window,"resize",d.hitch(this,this.resize)));setTimeout(d.hitch(this,function(){this.resize()}),100);this.loading=new x({hidden:!0});this.loading.placeAt(this.domNode);this.loading.startup()},searchWidget:function(a){var c;c=""===a?this.allWidgets:f.filter(this.allWidgets,function(c){if(-1<
c.label.toUpperCase().indexOf(a.toUpperCase()))return!0});this._createWidgetNodes(c)},resize:function(){var a=b.getContentBox(this.domNode).h-50-10,c=a-60;b.setStyle(this.searchSectionNode,{height:a+"px"});b.setStyle(this.widgetListNode,{height:c+"px"})},setAppConfig:function(a){this.appConfig=a},_getWidgets:function(){var a={};this.appConfig.map["2D"]&&(a.support2D=!0);this.appConfig.map["3D"]&&(a.support3D=!0);this.appConfig.map["2D"]&&this.appConfig.map["3D"]&&(a.support2D=!0,a.support3D=!0);a["properties.inPanel"]=
!0;a.platform=window.stemappInfo.appType;m.searchWidgets(a).then(d.hitch(this,function(a){a.success?(this.allWidgets=a.widgets,this._createWidgetNodes(this.allWidgets)):console.log(a.message)}))},_createWidgetNodes:function(a){b.empty(this.widgetListNode);f.forEach(a,function(a){e.processManifestLabel(a,dojoConfig.locale);this._createWidgetNode(a)},this)},_createWidgetNode:function(a){var c,g;c=b.create("div",{"class":"widget-node"},this.widgetListNode);g=b.create("div",{"class":"box"},c);b.create("div",
{"class":"box-border"},c);b.create("img",{"class":"icon",src:a.icon},g);b.create("div",{"class":"label",innerHTML:a.label,title:a.label},c);c.setting={name:a.name,label:a.label,version:a.version};e.addManifestProperies(a);e.addManifest2WidgetJson(c.setting,a);c.setting.icon="widgets/"+a.name+"/images/icon.png";c.setting.uri="widgets/"+a.name+"/Widget";e.processWidgetSetting(c.setting);c.box=g;this.own(h(c,"click",d.hitch(this,this._onWidgetClick,c)));return c},_onWidgetClick:function(a){"addBtn"===
this.fromNode.type?b.hasClass(a,"jimu-state-selected")?b.removeClass(a,"jimu-state-selected"):b.addClass(a,"jimu-state-selected"):(k(".jimu-state-selected",this.domNode).removeClass("jimu-state-selected"),b.addClass(a,"jimu-state-selected"))},onOk:function(){var a=k(".jimu-state-selected",this.domNode);if(0===a.length)new l({message:this.nls.emptyMessage});else{this.loading.show();var c=f.map(a,function(a){return d.clone(a.setting)}),b=[];f.forEach(c,function(a){b.push(this._copyWidget(a))},this);
r(b).then(d.hitch(this,function(a){var b;for(b=0;b<a.length;b++)if(!a[b].success){new l({message:a[b].message});this.loading.hide();return}this.loading.hide();p.publish("widgetChoosePageOk",c,this.fromNode);this.popup.close()}))}},_copyWidget:function(a){var c=0,b,f=[];this.appConfig.visitElement(d.hitch(this,function(b){b.name===a.name&&c++;f.push(b.label)}));if(0===c)a.label=a.label,b=m.copyWidgetToApp(window.appInfo.appId,a.name);else if(0<c){b=new q;for(var e=a.label+"_"+(c+1);-1<f.indexOf(e);)c++,
e=a.label+"_"+(c+1);a.label=e;b.resolve({success:!0})}return b}})});