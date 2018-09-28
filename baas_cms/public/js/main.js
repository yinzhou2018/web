(function() {

  window.global = {
    userName: '',
  };

  let seed = 1;
  const ID_APP_LIST = seed++;
  const ID_APP_APPLY = seed++;
  const ID_APP_APPROVAL_LIST = seed++;
  const ID_CONTAINER_LIST = seed++;
  const ID_CONTAINER_APPLY = seed++;

  async function showAppList(node) {
    if (tabsView.activateTab(node.text)) {
      return;
    }

    await utils.require('js/app_list_panel.js');
    const appListPanel = new AppListPanel(node.text);
    appListPanel.show();
  }

  function newApp() {
    let index = 1;
    const impl = async(node) => {
      let title = node.text + ':unnamedapp' + index++;
      await utils.require('js/app_editor_panel.js');
      let appEditorPanel = new AppEditorPanel(title, '', AppEditorPanel.NEWAPP);
      appEditorPanel.show();
    }
    return impl;
  }

  const menuModel = [{
      text: '应用管理',
      children: [{
          id: ID_APP_LIST,
          text: '应用列表',
          action: showAppList,
        },
        {
          id: ID_APP_APPLY,
          text: '新建应用',
          action: newApp()
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

  $(document).ready(function() {
    global.userName = $('#user').text();
    window.appsModel = new BaseModel('/api/app', {
      createName: 'onAppCreated',
      removeName: 'onAppRemoved',
      updateName: 'onAppUpdated'
    });
    navigatorView.init(menuModel, ID_APP_LIST);
  });
})();