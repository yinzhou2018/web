class CodeListPanel extends EntryListPanel {
  constructor(title) {
    const params = {
      title,
      failMsgId: 'code_list_fail_msg',
      failCauseId: 'code_list_fail_cause',
      dgId: 'dg_code_list',
      tbId: 'tb_code_list',
      toolbar: [
        {
          label: '名称',
          type: 'textbox',
          id: 'code_name'
        },
        {
          label: '修改人',
          type: 'textbox',
          id: 'code_updater'
        },
        {
          label: '类型',
          type: 'combobox',
          id: 'code_type',
          options: utils.object2Array(global.CodeType)
        },
        {
          label: '状态',
          type: 'combobox',
          id: 'code_status',
          options: utils.object2Array(global.CodeStatus)
        }
      ],
      columns: [
        {
          dataOptions: `field:'id',width:50`,
          title: 'ID'
        },
        {
          dataOptions: `field:'name',width:100`,
          title: '名称'
        },
        {
          dataOptions: `field:'type',width:100, formatter:_formatType`,
          title: '类型'
        },
        {
          dataOptions: `field:'status',width:100, formatter:_formatStatus`,
          title: '状态'
        },
        {
          dataOptions: `field:'edit_time', width:100`,
          title: '修改时间'
        },
        {
          dataOptions: `field:'rtx', width:100`,
          title: '修改人'
        },
        {
          dataOptions: `field:'operation', width:150, formatter:_formatOperation`,
          title: '操作'
        }
      ]
    };
    super(params);
  }

  onDocReady() {
    $('#code_type').combobox('select', global.CodeType.ALL.text);
    $('#code_status').combobox('select', global.CodeStatus.ALL.text);
    super.onDocReady();
  }

  _getSearchCondition() {
    const condition = {};
    const name = $('#code_name').textbox('getText');
    const rtx = $('#code_updater').textbox('getText');
    const type = $('#code_type').combobox('getValue');
    const status = $('#code_status').combobox('getValue');
    if (name.length !== 0) {
      condition.name = name;
    }
    if (rtx.length !== 0) {
      condition.rtx = rtx;
    }
    if (type !== global.CodeType.ALL.value) {
      condition.type = type;
    }
    if (status !== global.CodeStatus.ALL.value) {
      condition.status = status;
    }
    return condition;
  }

  _getModel() {
    return codesModel;
  }

  _fillExtraCondition(condition) {
    Object.assign(condition, {app_id: {op: '=', value: global.appId}});
  }

}; //CodeListPanel

function _formatType(value, rowData, rowIndex) {
  return global.getCodeTypeEntry(value).text;
}

function _formatStatus(value, rowData, rowIndex) {
  return global.getCodeStatusEntry(value).text;
}

function _formatOperation(value, rowData, rowIndex) {
  return `<a href='javascript:_browserCode("${rowData.id}")' style='margin-right:10px'>详情</a>
  <a href='javascript:_editCode("${rowData.id}")' style='margin-right:10px'>编辑</a>
  <a href='javascript:_removeCode("${rowData.id}")'>删除</a>`;
}

function _browserCode(id) {

}

function _editCode(id) {

}

function _removeCode(id) {

}