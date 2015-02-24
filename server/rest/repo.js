function Repository(e){this.name=e.name,this.type=e.type,this.url=e.url,this.category=e.category;var t=this;this.getRepositoryItems=function(e){"local_folder"===this.type&&getItemsFromLocalFolder(this,function(t){e(t)})},this.setChangeListener=function(){watchDir(this.url,{created:function(e,n){var o;n.isDirectory()&&fs.existsSync(path.join(e,"manifest.json"))?(logger.info("new",t.category,path.join(e,"manifest.json")),o=getRepoItemFromFile(t,path.join(e,"manifest.json")),getItemByName(o.name,function(e,t){null===t&&insertItemToDB(o)})):e.endWith("manifest.json")&&(logger.info("new",t.category,e),o=getRepoItemFromFile(t,e),getItemByName(o.name,function(e,t){null===t&&insertItemToDB(o)}))},changed:function(e){if(e.endWith("manifest.json")){logger.info(t.category,"changed:",e);var n=getRepoItemFromFile(t,e);getItemByName(n.name,function(e,o){null===o?t.getRepositoryItems(function(e){removeNotExistItemFromDB(t,e),insertItemToDB(n)}):updateItemInDB(n)})}},removed:function(e){if(e.endWith("manifest.json")){logger.info(t.category,"removed:",e);var n=e.split(path.sep);n.pop();var o=n.pop();deleteItemFromDB({name:o})}}})}}function watchDir(e,t){logger.debug("watch dir: ",e),watch.createMonitor(e,{ignoreDotFiles:!0,interval:2e3},function(e){e.on("created",function(e,n){n.isDirectory()&&watchDir(e,t),t.created&&t.created(e,n)}),e.on("changed",t.changed),e.on("removed",t.removed)})}function watchRepository(e){logger.info("watch repository change: ",e.url),e.setChangeListener(function(){})}function getItemByName(e,t){dbutils.find("repoitems",{name:e},function(e,n){e?t(e):0===n.length?t(null,null):t(null,n[0])})}function getItemsByCategory(e,t){dbutils.find("repoitems",{category:e},t)}function getItemInArray(e,t){for(var n=0;n<e.length;n++)if(e[n].name===t.name)return e[n];return null}function insertItemToDB(e){e&&dbutils.insert("repoitems",e,function(e,t){t.forEach(function(e){logger.info("insert",e.name)})})}function updateItemInDB(e){dbutils.update("repoitems",{name:e.name},e,function(e,t){})}function deleteItemFromDB(e){dbutils.remove("repoitems",{name:e.name},function(t,n){n>0&&logger.info("delete",e.name)})}function refreshRepoItems(e){e.getRepositoryItems(function(t){t.forEach(function(e){getItemByName(e.name,function(t,n){null===n?insertItemToDB(e):updateItemInDB(e)})}),removeNotExistItemFromDB(e,t)})}function removeNotExistItemFromDB(e,t){getItemsByCategory(e.category,function(e,n){for(var o=0;o<n.length;o++){var i=getItemInArray(t,n[o]);i||deleteItemFromDB(n[o])}})}function getItemsFromLocalFolder(e,t){var n,o=[];fs.existsSync(path.join(e.url,".repoignore"))&&(n=fs.readFileSync(path.join(e.url,".repoignore"),{encoding:"utf-8"}),n&&(o=n.split("\r\n")));var i=[],r=fs.readdirSync(e.url);r.forEach(function(t){var n=path.join(e.url,t),r=n.substr(e.url.length);if(o.length>0&&isFolderIgnore(r,o))return!0;var s=path.join(n,"manifest.json");if(fs.existsSync(s)){var a=getRepoItemFromFile(e,s);a&&i.push(a)}}),t(i)}function existManifestFile(e){for(var t=0;t<e.length;t++)if("manifest.json"===e[t])return!0}function getRepoItemFromFile(e,t){var n=fse.readJsonSync(t),o=t.split(path.sep);return o.pop(),n.location=o.join(path.sep),n.properties&&n.properties.isThemeWidget?null:processManifest(e,n)?(addI18NLabel(n),n):null}function processManifest(e,t){if(t.url="/"+e.category+"s/"+t.name+"/",t.icon=t.url+"images/icon.png",t.category=e.category,"widget"===e.category&&addWidgetManifestProperties(t),"theme"===e.category){if(!t.layouts)return logger.error("no layout is found in the theme",t.name),!1;addThemeManifestProperies(t)}return!0}function addI18NLabel(e){if(e.i18nLabels={},fs.existsSync(path.join(e.location,"nls/strings.js"))){var t="widget"===e.category?"_widgetLabel":"_themeLabel",n=requirejs(path.join(e.location,"nls/strings.js"));n.root&&n.root[t]&&(e.i18nLabels.defaultLabel=n.root[t],"theme"===e.category&&(e.layouts&&e.layouts.forEach(function(t){e["i18nLabels_layout_"+t.name]={},e["i18nLabels_layout_"+t.name].defaultLabel=n.root["_layout_"+t.name]}),e.styles&&e.styles.forEach(function(t){e["i18nLabels_style_"+t.name]={},e["i18nLabels_style_"+t.name].defaultLabel=n.root["_style_"+t.name]})));for(var o in n)if("root"!==o&&n[o]){var i=requirejs(path.join(e.location,"nls",o,"strings.js"));i[t]&&(e.i18nLabels[o]=i[t]),"theme"===e.category&&(e.layouts&&e.layouts.forEach(function(t){e["i18nLabels_layout_"+t.name][o]=i["_layout_"+t.name]}),e.styles&&e.styles.forEach(function(t){e["i18nLabels_style_"+t.name][o]=i["_style_"+t.name]}))}}}function addWidgetManifestProperties(e){"undefined"!=typeof e["2D"]&&(e.support2D=e["2D"]),"undefined"!=typeof e["3D"]&&(e.support3D=e["3D"]),"undefined"==typeof e["2D"]&&"undefined"==typeof e["3D"]&&(e.support2D=!0),delete e["2D"],delete e["3D"],"undefined"==typeof e.properties&&(e.properties={}),sharedUtils.processWidgetProperties(e)}function addThemeManifestProperies(e){e.panels||(e.panels=[]),e.styles||(e.styles=[]),e.widgets||(e.widgets=[]),e.panels.forEach(function(e){e.uri="panels/"+e.name+"/Panel.js"}),e.styles.forEach(function(e){e.uri="styles/"+e.name+"/style.css"}),e.layouts.forEach(function(t){t.uri="layouts/"+t.name+"/config.json",t.icon="layouts/"+t.name+"/icon.png",t.RTLIcon=fs.existsSync(path.join(e.location,"layouts",t.name,"icon_rtl.png"))?"layouts/"+t.name+"/icon_rtl.png":"layouts/"+t.name+"/icon.png"}),e.widgets.forEach(function(t){var n=fse.readJsonSync(path.join(e.location,"widgets",t.name,"manifest.json"));return n.properties&&n.properties.isThemeWidget?void 0:void logger.error('widget in theme should have "isThemeWidget:true" setting in widget manifest.json.',"theme:",e.name,",widget:",t.name)})}function isFolderIgnore(e,t){for(var n=0;n<t.length;n++)if(e===t[n])return!0;return!1}var path=require("path"),fs=require("fs"),settingRest=require("./settings"),utils=require("../utils"),fse=require("fs-extra"),logger=require("log4js").getLogger("repo"),dbutils=require("../dbutils"),watch=require("watch"),requirejs=require("requirejs"),sharedUtils=requirejs("jimu/shared/utils");exports.initWorkingRepositories=function(){var e=new Repository({name:"working theme repository",type:"local_folder",url:path.join(__dirname,"../../client/stemapp/themes/"),category:"theme"}),t=new Repository({name:"working widget repository",type:"local_folder",url:path.join(__dirname,"../../client/stemapp/widgets/"),category:"widget"});refreshRepoItems(e),refreshRepoItems(t),watchRepository(e),watchRepository(t)},exports.getItemsByCategory=getItemsByCategory,exports.getItemByName=getItemByName,exports.addI18NLabel=addI18NLabel;