class AppListPanel extends EntryListPanel {
  constructor(title) {
    const params = {
      title,
      failMsgId: 'app_list_fail_msg',
      failCauseId: 'app_list_fail_cause',
      dgId: 'dg_app_list',
      tbId: 'tb_app_list',
      toolbar: [
        {
          label: '应用名',
          type: 'textbox',
          id: 'app_id'
        },
        {
          label: '修改人',
          type: 'textbox',
          id: 'app_updater'
        }
      ],
      columns: [
        {
          dataOptions: `field:'id',hidden:true`,
          title: 'ID'
        },
        {
          dataOptions: `field:'app_id',width:150,formatter:_formatAppId`,
          title: '应用名'
        },
        {
          dataOptions: `field:'edit_time', width:200`,
          title: '修改时间'
        },
        {
          dataOptions: `field:'rtx', width:150`,
          title: '修改人'
        },
        {
          dataOptions: `field:'operation', formatter:_formatOperation, width:200`,
          title: '操作'
        }
      ]
    };
    super(params);
  }

  _getSearchCondition() {
    const condition = {};
    const app_id = $('#app_id').textbox('getText');
    const rtx = $('#app_updater').textbox('getText');
    if (app_id.length !== 0) {
      condition.app_id = app_id;
    }
    if (rtx.length !== 0) {
      condition.rtx = rtx;
    }
    return condition;
  }

  _getModel() {
    return appsModel;
  }
}; //AppListPanel

function _formatAppId(value, rowData, rowIndex) {
  return `<a href=apps/${value} title="进入应用" class="easyui-tooltip">${value}</a>`;
}

function _formatOperation(value, rowData, rowIndex) {
  return `<a href='javascript:_browserApp("${rowData.app_id}")' style='margin-right:10px'>详情</a>
  <a href='javascript:_editApp("${rowData.app_id}")' style='margin-right:10px'>编辑</a>
  <a href='javascript:_removeApp("${rowData.id}")'>删除</a>`;
}

async function _browserApp(appId) {
  let title = '应用详情: ' + appId;
    if (tabsView.activateTab(title)) {
      return;
    }

    await utils.require('js/app_editor_panel.js');
    const appEditorPanel = new AppEditorPanel(title, appId, AppEditorPanel.BROWSERAPP);
    appEditorPanel.show();
}

async function _editApp(appId) {
  const title = '应用编辑: ' + appId;
  if (tabsView.activateTab(title)) {
    return;
  }

  await utils.require('js/app_editor_panel.js');
  const appEditorPanel = new AppEditorPanel(title, appId, AppEditorPanel.EDITAPP);
  appEditorPanel.show();
}

function _removeApp(id) {
  appsModel.remove(id);
}