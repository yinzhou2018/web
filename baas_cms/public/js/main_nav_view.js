(function() {

  var seed = 1;
  const ID_APP_LIST = seed++;
  const ID_APP_APPLY = seed++;
  const ID_APP_APPROVAL_LIST = seed++;
  const ID_CONTAINER_LIST = seed++;
  const ID_CONTAINER_APPLY = seed++;

  const menuModel = [{
      text: '应用管理',
      children: [{
          id: ID_APP_LIST,
          text: '应用列表',
          template_id: 'app_list_panel',
          singleton: true
        },
        {
          id: ID_APP_APPLY,
          text: '新建应用',
          action: applyApp()
        }
      ]
    },
    {
      text: "容器管理",
      children: [{
          id: ID_CONTAINER_LIST,
          text: '容器列表'
        },
        {
          id: ID_CONTAINER_APPLY,
          text: '新建容器'
        }
      ]
    }
  ]; //menuModel

  function applyApp() {
    let index = 1;
    const impl = (node) => {
      let title = '新建应用:unnamedapp' + index++;
      mainTabsView.addTab('app_configuration_panel', title, false);
      appConfigurationPanel.init(title, '', true, false);
    }
    return impl;
  }

  const mainNavView = {
    async init() {
      await utils.require('js/main_tabs_view.js');

      $("#menu").tree('loadData', menuModel);

      let app_list_node = $("#menu").tree('find', ID_APP_LIST);
      $("#menu").tree('select', app_list_node.target);
      mainTabsView.addTab(app_list_node.template_id, app_list_node.text, true);

      $("#menu").tree({
        onClick: (node) => {
          if (node.template_id) {
            mainTabsView.addTab(node.template_id, node.text, node.singleton);
          } else {
            node.action(node);
          }
        }
      });
    }
  };

  window.mainNavView = mainNavView;
}())