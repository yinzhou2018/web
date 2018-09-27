class AppEditorPanel extends TabPanel {
  constructor(title, appId, type) {
    const index = AppEditorPanel.seed++;
    const templateParams = {
      appId: `${appId}_${index}`,
      descEditorId: `${appId}_desc_id_${index}`,
      confEditorId: `${appId}_conf_id_${index}`,
      btnCommitId: `${appId}_commit_id_${index}`,
      btnCancelId: `${appId}_cancel_id_${index}`
    }

    super(title, 'views/app_editor_panel.ejs', templateParams);
    this.appId = appId;
    this.type = type;
  }

  async onDocReady() {
    await utils.require('js/apps_model.js');

    if (this.type !== AppEditorPanel.NEWAPP) {
      $(`#${this.templateParams.appId}`).textbox({ readonly: true });

      const { errorCode, errorMsg, app } = await appsModel.get(this.appId);
      if (errorCode === 0) {
        $(`#${this.templateParams.appId}`).textbox('setText', this.appId);
        $(`#${this.templateParams.descEditorId}`).textbox('setText', app.description);
        $(`#${this.templateParams.confEditorId}`).textbox('setText', JSON.stringify(app.configuration));
      } else {
        $('#app_editor_fail_cause').text(errorMsg);
        $('#app_editor_fail_msg').css('display', 'block');
      }
    }

    if (this.type === AppEditorPanel.BROWSERAPP) {
      $(`#${this.templateParams.descEditorId}`).textbox({ readonly: true });
      $(`#${this.templateParams.confEditorId}`).textbox({ readonly: true });
      $(`#${this.templateParams.btnCommitId}`).hide();
    }

    $(`#${this.templateParams.btnCommitId}`).click(this.commit.bind(this));
    $(`#${this.templateParams.btnCancelId}`).click(this.cancel.bind(this));

    appsModel.addListener(this);
  }

  cancel(e) {
    e.preventDefault();
    tabsView.closeTab(this.title);
  }

  commit(e) {
    e.preventDefault();
    const appId = $(`#${this.templateParams.appId}`).textbox('getText');
    const description = $(`#${this.templateParams.descEditorId}`).textbox('getText');
    let configuration = $(`#${this.templateParams.confEditorId}`).textbox('getText');
    configuration = JSON.parse(configuration);
    const app = { appId, description, configuration };

    if (this.type === AppEditorPanel.NEWAPP) {
      const promise = appsModel.add(app);
      this._showOpStatus(promise, appId);
    } else {
      const promise = appsModel.update(app);
      this._showOpStatus(promise, appId);
    }
  }

  onAppUpdated({ appId, description, configuration }) {
    if (this.type === AppEditorPanel.BROWSERAPP && this.appId === appId) {
      $(`#${this.templateParams.descEditorId}`).textbox('setText', description);
      $(`#${this.templateParams.confEditorId}`).textbox('setText', JSON.stringify(configuration));
    }
  }

  onAppRemoved(appId) {
    if (this.appId === appId) {
      tabsView.closeTab(this.title);
    }
  }

  onClosed() {
    appsModel.removeListener(this);
  }

  _showOpStatus(promise, appId) {
    const tabTitle = this.title;
    const text = (this.type === AppEditorPanel.NEWAPP) ? '创建' : '更新';
    $.messager.progress({
      title: '请稍候',
      msg: `应用${text}中...`
    });
    promise.then(({ errorCode, errorMsg, app }) => {
      $.messager.progress('close');
      if (errorCode !== 0) {
        $.messager.alert({
          title: '失败',
          msg: `应用(${appId})${text}失败，原因:${errorMsg}`,
          icon: 'error'
        });
      } else {
        $.messager.confirm({
          title: '成功',
          msg: `应用(${appId})${text}成功，是否关闭当前面板？`,
          fn: function(r) {
            if (r) {
              tabsView.closeTab(tabTitle);
            }
          }
        });
      }
    })
  }
};

AppEditorPanel.NEWAPP = 'newapp';
AppEditorPanel.EDITAPP = 'editapp';
AppEditorPanel.BROWSERAPP = 'browserapp';

AppEditorPanel.seed = 1;