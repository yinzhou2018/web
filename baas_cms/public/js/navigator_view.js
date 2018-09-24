const navigatorView = {
  async init(menuModel, default_node_id) {
    $("#menu").tree('loadData', menuModel);

    $("#menu").tree({
      onSelect: (node) => {
        node.action(node);

        $("#menu").tree({onSelect: (node) => {}});
      }
    });

    let default_node = $("#menu").tree('find', default_node_id);
    $("#menu").tree('select', default_node.target);

    $("#menu").tree({
      onClick: (node) => {
          node.action(node);
        }
    });
  }
};