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

      const { errorCode, errorMsg, app: { configuration } } = await appsModel.get(this.appId);
      if (errorCode === 0) {
        $(`#${this.templateParams.appId}`).textbox('setText', this.appId);
        $(`#${this.templateParams.descEditorId}`).textbox('setText', '啥也没留下');
        $(`#${this.templateParams.confEditorId}`).textbox('setText', JSON.stringify(configuration));
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
      appsModel.add(app);
    } else {
      appsModel.update(app);
    }
  }

  onAppUpdated(app) {
    if (this.type === AppEditorPanel.BROWSERAPP && this.appId === app.appId) {
      $(`#${this.templateParams.descEditorId}`).textbox('setText', app.description);
      $(`#${this.templateParams.confEditorId}`).textbox('setText', JSON.stringify(app.configuration));
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
};

AppEditorPanel.NEWAPP = 'newapp';
AppEditorPanel.EDITAPP = 'editapp';
AppEditorPanel.BROWSERAPP = 'browserapp';

AppEditorPanel.seed = 1;