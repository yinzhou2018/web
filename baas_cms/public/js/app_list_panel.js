(function() {
  async function init() {
    await utils.require('js/apps_model.js');
    apps = await appsModel.getAll();
    if (apps.length !== 0) {
      $('#dg_app_list').datagrid('loadData', apps);
    }
  }

  init();

  const appListPanel = {
    formatAppId(value, rowData, rowIndex) {
      return `<a href=${value} title="进入应用" class="easyui-tooltip">${value}</a>`;
    },

    formatOperation(value, rowData, rowIndex) {
      return `<a href='javascript:appListPanel.browserApp("${rowData.appId}")' style='margin-right:10px'>详情</a>
              <a href='javascript:appListPanel.editApp("${rowData.appId}")'>编辑</a>`;
    },

    async editApp(appId) {
      let title = `应用编辑: ${appId}`;
      mainTabsView.addTab('app_configuration_panel', title, true);
      appConfigurationPanel.init(title, appId, false, false);
    },

    async browserApp(appId) {
      let title = `应用详情: ${appId}`;
      mainTabsView.addTab('app_configuration_panel', title, true);
      appConfigurationPanel.init(title, appId, false, true);
    }
  };

  window.appListPanel = appListPanel;
}())