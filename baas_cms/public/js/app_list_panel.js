function AppListPanel(title) {
  this.title = title;
  return this;
}

AppListPanel.prototype = new TabPanel();

AppListPanel.prototype.tabParams = function() {
  return  { title: this.title, url: "views/app_list_panel.ejs" };
}

AppListPanel.prototype.documentReady = async function() {
  await utils.require('js/apps_model.js');
  apps = await appsModel.getAll();
  if (apps.length !== 0) {
    $('#dg_app_list').datagrid('loadData', apps);
  }
}

AppListPanel.prototype.formatAppId = function(value, rowData, rowIndex) {
  return `<a href=${value} title="进入应用" class="easyui-tooltip">${value}</a>`;
}

AppListPanel.prototype.formatOperation = function(value, rowData, rowIndex) {
  return `<a href='javascript:appListPanel.browserApp("${rowData.appId}")' style='margin-right:10px'>详情</a>
  <a href='javascript:appListPanel.editApp("${rowData.appId}")'>编辑</a>`;
}

AppListPanel.prototype.editApp = async function(appId) {
  let title = '应用编辑: ' + appId;
  if (tabsView.activateTab(title)) {
    return;
  }

  await utils.require('js/app_editor_panel.js');
  appEditorPanel = new AppEditorPanel(title, appId, false, false);
  appEditorPanel.show();  
}

AppListPanel.prototype.browserApp = async function(appId) {
  let title = '应用详情: ' + appId;
  if (tabsView.activateTab(title)) {
    return;
  }

  await utils.require('js/app_editor_panel.js');
  appEditorPanel = new AppEditorPanel(title, appId, false, true);
  appEditorPanel.show(); 
}

appListPanel = new AppListPanel();