class CodeListPanel extends TabPanel {
  constructor(title) {
    super(title, 'views/code_list_panel.ejs');
    codeListPanel = this;
  }

  onDocReady() {
    $('#code_type').combobox({ data: utils.object2Array(global.CodeType) });
    $('#code_type').combobox('select', global.CodeType.ALL.text);
    $('#code_status').combobox({ data: utils.object2Array(global.CodeStatus) });
    $('#code_status').combobox('select', global.CodeStatus.ALL.text);
  }

  onClosed() {
    codeListPanel = null;
  }


};

codeListPanel = null