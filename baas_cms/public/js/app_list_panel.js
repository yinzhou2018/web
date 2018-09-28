class AppListPanel extends TabPanel {
  constructor(title) {
    super(title, 'views/app_list_panel.ejs');
    this.searchStatus = {
      enter: false,
      appId: '',
      updateUser: ''
    };
    appListPanel = this;
  }

  async onDocReady() {
    const pager = $('#dg_app_list').datagrid('getPager');
    pager.pagination({
      onSelectPage: this._onPageChanged.bind(this),
      onRefresh: this._onPageChanged.bind(this),
      onChangePageSize: this._onPageChanged.bind(this, 1)
    });

    const opt = pager.pagination('options');
    this._reload(opt.pageNumber, opt.pageSize);
    appsModel.addListener(this);
  }

  formatAppId(value, rowData, rowIndex) {
    return `<a href=apps/${value} title="进入应用" class="easyui-tooltip">${value}</a>`;
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

  async search() {
    const appId = $('#app_name').textbox('getText');
    const updateUser = $('#app_updater').textbox('getText');
    Object.assign(this.searchStatus, {
      enter: (appId.length !== 0 || updateUser.length !== 0),
      appId,
      updateUser
    });

    const pager = $('#dg_app_list').datagrid('getPager');
    const opt = pager.pagination('options');
    this._reload(1, opt.pageSize);
  }

  onClosed() {
    appListPanel = null;
    appsModel.removeListener(this);
  }

  onAppCreated(app) {
    const pager = $('#dg_app_list').datagrid('getPager');
    const { pageNumber, pageSize } = pager.pagination('options');
    this._reload(pageNumber, pageSize);
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
    const pager = $('#dg_app_list').datagrid('getPager');
    const { total, pageNumber, pageSize } = pager.pagination('options');
    const realTotal = total - 1;
    const realPageNumber = (realTotal / pageSize) + ((realTotal % pageSize) ? 1 : 0);
    this._reload(pageNumber > realPageNumber ? realPageNumber : pageNumber, pageSize);
  }

  _onPageChanged(pageNumber, pageSize) {
    this._reload(pageNumber, pageSize);
  }

  async _reload(pageNumber, pageSize) {
    const offset = ((pageNumber === 0 ? 1 : pageNumber) - 1) * pageSize;
    const options = { offset, limit: pageSize };
    if (this.searchStatus.enter) {
      Object.assign(options, { appId: this.searchStatus.appId, updateUser: this.searchStatus.updateUser });
    }

    const { errorCode, errorMsg, enties: apps, total } = await appsModel.query(options);

    if (errorCode === 0) {
      $('#dg_app_list').datagrid('loadData', apps);
      const pager = $('#dg_app_list').datagrid('getPager');
      pager.pagination({ total, pageNumber });
    } else {
      $('#app_list_fail_cause').text(errorMsg);
      $('#app_list_fail_msg').css('display', 'block');
    }
  }
};

let appListPanel = null;