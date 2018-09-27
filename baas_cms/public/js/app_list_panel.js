class AppListPanel extends TabPanel {
  constructor(title) {
    super(title, 'views/app_list_panel.ejs');
  }

  async onDocReady() {
    await utils.require('js/apps_model.js');

    const pager = $('$dg_app_list').datagrid('getPager');
    pager.pagination({
      onSelectPage: this._onPageChanged.bind(this),
      onRefresh: this._onPageChanged.bind(this),
      onChangePageSize: this._onPageChanged.bind(this, 1)
    });

    this._reload('', '', 0, 10);
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
    const rows = $('#dg_app_list').datagrid('getRows');
    for (let i = 0; i < rows.length; ++i) {
      if (rows[i].appId === app.appId) {
        $('#dg_app_list').datagrid('updateRow', { index: i, row: app });
        break;
      }
    }
  }

  onAppRemoved(appId) {
    const rows = $('#dg_app_list').datagrid('getRows');
    for (let i = 0; i < rows.length; ++i) {
      if (rows[i].appId === appId) {
        $('#dg_app_list').datagrid('deleteRow', i);
        break;
      }
    }
  }

  _onPageChanged(pageNumber, pageSize) {

  }

  async _reload(appId, updateUser, offset, limit) {
    options = { offset, limit };
    if (appId.length !== 0) {
      options.appId = appId;
    }
    if (updateUser.length !== 0) {
      options.updateUser = updateUser;
    }

    const { errorCode, errorMsg, apps, total } = await appsModel.query(options);

    if (errorCode === 0) {
      $('#dg_app_list').datagrid('loadData', apps);
      const pager = $('$dg_app_list').datagrid('getPager');
      pager.pagination({ total, pageNumber: offset / limit + 1 });
    } else {
      $('#app_list_fail_cause').text(errorMsg);
      $('#app_list_fail_msg').css('display', 'block');
    }
  }
};

const appListPanel = new AppListPanel('应用列表');