(function() {
  const data = {};

  function cancel(e) {
    e.preventDefault();
    mainTabsView.closeTab(data.title);
  }

  function commit(e) {
    e.preventDefault();
    console.log(data);
  }

  const appConfigurationPanel = {
    async init(title, appId) {
      data.title = title;
      data.appId = appId;

      $('#app_id').text(appId);
      $('#app_desc').textbox('setText', appsModel.get(appId).description);
      $('#app_conf').textbox('setText', JSON.stringify(appsModel.get(appId).configuration));
      $('#app_conf_commit').click(commit);
      $('#app_conf_cancel').click(cancel);

      //修改元素ID来避免多个编辑界面时的逻辑混乱，比较trick的方法！
      $('#app_id').attr('id', `${appId}_id`);
      $('#app_desc').attr('id', `${appId}_desc`);
      $('#app_conf').attr('id', `${appId}_conf`);
      $('#app_conf_commit').attr('id', `${appId}_conf_commit`);
      $('#app_conf_cancel').attr('id', `${appId}_conf_cancel`);
    },
  };

  window.appConfigurationPanel = appConfigurationPanel;
}())