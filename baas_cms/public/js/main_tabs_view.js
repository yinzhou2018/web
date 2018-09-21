(function() {

  const mainTabsView = {
    addTab(template_id, title, singleton) {
      if (singleton) {
        let tab = $('#tabs').tabs("getTab", title);
        if (tab) {
          $('#tabs').tabs("select", title)
          return;
        }
      }

      let content = $(`#${template_id}`).html();
      $("#tabs").tabs("add", { title, content, closable: true });
    },

    closeTab(title) {
      $('#tabs').tabs("close", title);
    }
  };

  window.mainTabsView = mainTabsView;

}())