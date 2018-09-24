function AppEditorPanel(title, appId, newapp, readonly) {
  this.title = title;
  this.appId = appId;
  this.newapp = newapp;
  this.readonly = readonly;

  let index = AppEditorPanel.seed++;
  this.templateParams = {
    appId: `${appId}_${index}`,
    descEditorId: `${appId}_desc_id_${index}`,
    confEditorId: `${appId}_conf_id_${index}`,
    btnCommitId: `${appId}_commit_id_${index}`,
    btnCancelId: `${appId}_cancel_id_${index}`
  }

  return this;
}

AppEditorPanel.seed = 1;

AppEditorPanel.prototype = new TabPanel();

AppEditorPanel.prototype.tabParams = function() {
  return { 
    title: this.title,
    url: "views/app_editor_panel.ejs",
    params: this.templateParams
  };
}

AppEditorPanel.prototype.documentReady = function() {
  if (!this.newapp) {
    $(`#${this.templateParams.appId}`).textbox('setText', this.appId);
    $(`#${this.templateParams.descEditorId}`).textbox('setText', appsModel.get(this.appId).description);
    $(`#${this.templateParams.confEditorId}`).textbox('setText', JSON.stringify(appsModel.get(this.appId).configuration));
    $(`#${this.templateParams.btnCommitId}`).click(this.commit.bind(this));
    $(`#${this.templateParams.btnCancelId}`).click(this.cancel.bind(this));
  }

  if (this.readonly) {
    $(`#${this.templateParams.appId}`).textbox({ readonly: true });
    $(`#${this.templateParams.descEditorId}`).textbox({ readonly: true });
    $(`#${this.templateParams.confEditorId}`).textbox({ readonly: true });
    $(`#${this.templateParams.btnCommitId}`).hide();
  }
}

AppEditorPanel.prototype.cancel = function(e) {
  e.preventDefault();
  tabsView.closeTab(this.title);
}

AppEditorPanel.prototype.commit = function(e) {
  e.preventDefault();
}