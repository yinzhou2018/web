var seed = 1;
const ID_APP_LIST = seed++;
const ID_APP_APPLY = seed++;
const ID_APP_APPROVAL_LIST = seed++;
const ID_CONTAINER_LIST = seed++;
const ID_CONTAINER_APPLY = seed++;
const ID_CONTAINER_APPROVAL_LIST = seed++;

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
        text: '应用申请',
        action: applyApp
      },
      {
        id: ID_APP_APPROVAL_LIST,
        text: '应用审批列表'
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
        text: '容器申请'
      },
      {
        id: ID_CONTAINER_APPROVAL_LIST,
        text: '容器审批列表'
      }
    ]
  }
]; //menuModel

function addTab(template_id, title, singleton) {
  if (singleton) {
    let tab = $('#tabs').tabs("getTab", title);
    if (tab) {
      $('#tabs').tabs("select", title)
      return;
    }
  }

  let content = $(`#${template_id}`).html();
  $("#tabs").tabs("add", { title, content, closable: true });
}

function applyApp(node) {
  console.log('applyApp');
}

$(document).ready(function() {
  $("#menu").tree('loadData', menuModel);

  let app_list_node = $("#menu").tree('find', ID_APP_LIST);
  $("#menu").tree('select', app_list_node.target);
  addTab(app_list_node.template_id, app_list_node.text, true);

  $("#menu").tree({
    onClick: (node) => {
      if (node.template_id) {
        addTab(node.template_id, node.text, node.singleton);
      } else {
        node.action(node);
      }
    }
  });
})