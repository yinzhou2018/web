function AppListPanel(title) {
  this.title = title;
  return this;
}

AppListPanel.prototype = new TabPanel();

AppListPanel.prototype.tabParams = function() {
  return { title: this.title, url: "views/app_list_panel.ejs" };
}

AppListPanel.prototype.onDocReady = async function() {
  await utils.require('js/apps_model.js');
  apps = await appsModel.getAll();
  if (apps.length !== 0) {
    $('#dg_app_list').datagrid('loadData', apps);
  }
  appsModel.addListener(this);
}

AppListPanel.prototype.formatAppId = function(value, rowData, rowIndex) {
  return `<a href=${value} title="进入应用" class="easyui-tooltip">${value}</a>`;
}

AppListPanel.prototype.formatOperation = function(value, rowData, rowIndex) {
  return `<a href='javascript:appListPanel.browserApp("${rowData.appId}")' style='margin-right:10px'>详情</a>
  <a href='javascript:appListPanel.editApp("${rowData.appId}")' style='margin-right:10px'>编辑</a>
  <a href='javascript:appListPanel.removeApp("${rowData.appId}")'>删除</a>`;
}

AppListPanel.prototype.editApp = async function(appId) {
  let title = '应用编辑: ' + appId;
  if (tabsView.activateTab(title)) {
    return;
  }

  await utils.require('js/app_editor_panel.js');
  appEditorPanel = new AppEditorPanel(title, appId, AppEditorPanel.EDITAPP);
  appEditorPanel.show();
}

AppListPanel.prototype.browserApp = async function(appId) {
  let title = '应用详情: ' + appId;
  if (tabsView.activateTab(title)) {
    return;
  }

  await utils.require('js/app_editor_panel.js');
  appEditorPanel = new AppEditorPanel(title, appId, AppEditorPanel.BROWSERAPP);
  appEditorPanel.show();
}

AppListPanel.prototype.removeApp = async function(appId) {
  appsModel.remove(appId);
}

AppListPanel.prototype.onClosed = function() {
  appsModel.removeListener(this);
}

AppListPanel.prototype.onAppCreated = function(app) {
  $('#dg_app_list').datagrid('insertRow', { index: 0, row: app });
}

AppListPanel.prototype.onAppUpdated = function(app) {
  rows = $('#dg_app_list').datagrid('getRows');
  for (let i = 0; i < rows.length; ++i) {
    if (rows[i].appId === app.appId) {
      $('#dg_app_list').datagrid('updateRow', { index: i, row: app });
      break;
    }
  }
}

AppListPanel.prototype.onAppRemoved = function(appId) {
  rows = $('#dg_app_list').datagrid('getRows');
  for (let i = 0; i < rows.length; ++i) {
    if (rows[i].appId === appId) {
      $('#dg_app_list').datagrid('deleteRow', i);
      break;
    }
  }
}

appListPanel = new AppListPanel();