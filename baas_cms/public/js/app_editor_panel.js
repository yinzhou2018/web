function AppEditorPanel(title, appId, type) {
  this.title = title;
  this.appId = appId;
  this.type = type;

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

AppEditorPanel.NEWAPP = 'newapp';
AppEditorPanel.EDITAPP = 'editapp';
AppEditorPanel.BROWSERAPP = 'browserapp';

AppEditorPanel.seed = 1;

AppEditorPanel.prototype = new TabPanel();

AppEditorPanel.prototype.tabParams = function() {
  return {
    title: this.title,
    url: "views/app_editor_panel.ejs",
    params: this.templateParams
  };
}

AppEditorPanel.prototype.onDocReady = function() {
  if (this.type !== AppEditorPanel.NEWAPP) {
    $(`#${this.templateParams.appId}`).textbox({ readonly: true });
    $(`#${this.templateParams.appId}`).textbox('setText', this.appId);
    $(`#${this.templateParams.descEditorId}`).textbox('setText', appsModel.get(this.appId).description);
    $(`#${this.templateParams.confEditorId}`).textbox('setText', JSON.stringify(appsModel.get(this.appId).configuration));
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

AppEditorPanel.prototype.cancel = function(e) {
  e.preventDefault();
  tabsView.closeTab(this.title);
}

AppEditorPanel.prototype.commit = function(e) {
  e.preventDefault();
  let appId = $(`#${this.templateParams.appId}`).textbox('getText');
  let description = $(`#${this.templateParams.descEditorId}`).textbox('getText');
  let configuration = $(`#${this.templateParams.confEditorId}`).textbox('getText');
  configuration = JSON.parse(configuration);
  app = { appId, description, configuration };
  if (this.type === AppEditorPanel.NEWAPP) {
    appsModel.add(app);
  } else {
    appsModel.update(app);
  }
}

AppEditorPanel.prototype.onAppUpdated = function(app) {
  if (this.type === AppEditorPanel.BROWSERAPP && this.appId === app.appId) {
    $(`#${this.templateParams.descEditorId}`).textbox('setText', app.description);
    $(`#${this.templateParams.confEditorId}`).textbox('setText', JSON.stringify(app.configuration));
  }
}

AppEditorPanel.prototype.onAppRemoved = function(appId) {
  if (this.appId === appId) {
    tabsView.closeTab(this.title);
  }
}

AppEditorPanel.prototype.onClosed = function() {
  appsModel.removeListener(this);
}