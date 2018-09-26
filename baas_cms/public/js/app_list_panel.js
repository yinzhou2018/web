class AppListPanel extends TabPanel {
  constructor(title) {
    super(title, 'views/app_list_panel.ejs');
  }

  async onDocReady() {
    await utils.require('js/apps_model.js');
    const { errorCode, errorMsg, apps, total } = await appsModel.query({ offset: 0, limit: 20 });
    if (errorCode === 0 && apps.length !== 0) {
      $('#dg_app_list').datagrid('loadData', apps);
    }

    appsModel.addListener(this);
  }

  formatAppId(value, rowData, rowIndex) {
    return `<a href=${value} title="进入应用" class="easyui-tooltip">${value}</a>`;
  }

  formatOperation(value, rowData, rowIndex) {
    return `<a href='javascript:appListPanel.browserApp("${rowData.appId}")' style='margin-right:10px'>详情</a>
    <a href='javascript:appListPanel.editApp("${rowData.appId}")' style='margin-right:10px'>编辑</a>
    <a href='javascript:appListPanel.removeApp("${rowData.appId}")'>删除</a>`;
  }

  async editApp(appId) {
    const title = '应用编辑: ' + appId;
    if (tabsView.activateTab(title)) {
      return;
    }

    await utils.require('js/app_editor_panel.js');
    const appEditorPanel = new AppEditorPanel(title, appId, AppEditorPanel.EDITAPP);
    appEditorPanel.show();
  }

  async browserApp(appId) {
    let title = '应用详情: ' + appId;
    if (tabsView.activateTab(title)) {
      return;
    }

    await utils.require('js/app_editor_panel.js');
    const appEditorPanel = new AppEditorPanel(title, appId, AppEditorPanel.BROWSERAPP);
    appEditorPanel.show();
  }

  async removeApp(appId) {
    appsModel.remove(appId);
  }

  onClosed() {
    appsModel.removeListener(this);
  }

  onAppCreated(app) {
    $('#dg_app_list').datagrid('insertRow', { index: 0, row: app });
  }

  onAppUpdated(app) {
    rows = $('#dg_app_list').datagrid('getRows');
    for (let i = 0; i < rows.length; ++i) {
      if (rows[i].appId === app.appId) {
        $('#dg_app_list').datagrid('updateRow', { index: i, row: app });
        break;
      }
    }
  }

  onAppRemoved(appId) {
    rows = $('#dg_app_list').datagrid('getRows');
    for (let i = 0; i < rows.length; ++i) {
      if (rows[i].appId === appId) {
        $('#dg_app_list').datagrid('deleteRow', i);
        break;
      }
    }
  }
};

const appListPanel = new AppListPanel('应用列表');