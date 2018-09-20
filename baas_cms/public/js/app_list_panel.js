(function() {
  async function init() {
    await require('js/apps_model.js');
    apps = await appsModel.getAll();
    if (apps.length !== 0) {
      $('#dg_app_list').datagrid('loadData', apps);
    }
  }

  init();

  const appListPanel = {
    formatAppId(value, rowData, rowIndex) {
      return `<a href=${value}>${value}</a>`;
    },

    formatOperation(value, rowData, rowIndex) {
      return `<a href='javascript:appListPanel.editApp("${rowData.appId}")'>编辑</a>`;
    },

    async editApp(appId) {
      let title = `应用编辑: ${appId}`;
      mainTabsView.addTab('app_configuration_panel', title, true);
      appConfigurationPanel.init(title, appId);
    }
  };

  window.appListPanel = appListPanel;
}())