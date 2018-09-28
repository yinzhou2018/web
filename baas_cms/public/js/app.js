(function() {

  const CodeType = {
    ALL: {
      value: '',
      text: '全部'
    },
    FUNCTION: {
      value: 'function',
      text: '云函数'
    },
    JOB: {
      value: 'job',
      text: '计划任务'
    },
    MODULE: {
      value: 'module',
      text: '公共模块'
    },
  }

  const CodeStatus = {
    ALL: {
      text: '全部',
      value: -100
    },
    EDITING: {
      text: '编辑',
      value: 0
    },
    TESTING: {
      text: '测试',
      value: 3
    },
    PRE_PUBLISHED: {
      text: '预发布',
      value: 1
    },
    PUBLISHED: {
      text: '已发布',
      value: 2
    },
    OFFLINE: {
      text: '下线',
      value: -1
    },
  }

  window.global = {
    CodeType,
    CodeStatus,
    userName: '',
    appId: '',
    codesModel: null,
    getCodeTypeEntry(key) {
      for (e in CodeType) {
        if (CodeType[e].value === key || CodeType[e].text === key) {
          return CodeType[e];
        }
      }
      return null;
    },

    GetCodeStatusEntry(key) {
      for (e in CodeStatus) {
        if (CodeStatus[e].value === key || CodeStatus[e].text === key) {
          return CodeStatus[e];
        }
      }
      return null;
    }
  };

  let seed = 1;
  const ID_CODE_LIST = seed++;
  const ID_FUNCTION_CREATE = seed++;
  const ID_JOB_CREATE = seed++;
  const ID_MODULE_CREATE = seed++;
  const ID_CONFIG_LIST = seed++;
  const ID_CONFIG_CREATE = seed++;

  async function showCodeList(node) {
    if (tabsView.activateTab(node.text)) {
      return;
    }

    await utils.require('js/code_list_panel.js');
    const panel = new CodeListPanel(node.text);
    panel.show();
  }

  function newCode() {
    let index = 1;
    const impl = async(node) => {
      let title = node.text + ':unnamed' + index++;
    }
    return impl;
  }

  const menuModel = [{
      text: '云代码管理',
      children: [{
          id: ID_CODE_LIST,
          text: '代码列表',
          action: showCodeList,
        },
        {
          id: ID_FUNCTION_CREATE,
          text: `新建${CodeType.FUNCTION.text}`,
          action: newCode()
        },
        {
          id: ID_JOB_CREATE,
          text: `新建${CodeType.JOB.text}`,
          action: newCode()
        },
        {
          id: ID_MODULE_CREATE,
          text: `新建${CodeType.MODULE.text}`,
          action: newCode()
        }
      ]
    },
    {
      text: "云配置管理",
      children: [{
          id: ID_CONFIG_LIST,
          text: '配置列表'
        },
        {
          id: ID_CONFIG_CREATE,
          text: '新建配置'
        }
      ]
    }
  ]; //menuModel

  $(document).ready(function() {
    global.userName = $('#user').text();
    global.appId = $('#appId').text();
    window.codesModel = new BaseModel(`/api/${global.appId}/code`, {
      createName: 'onCodeCreated',
      removeName: 'onCodeRemoved',
      updateName: 'onCodeUpdated'
    });

    navigatorView.init(menuModel, ID_CODE_LIST);
  });

})()