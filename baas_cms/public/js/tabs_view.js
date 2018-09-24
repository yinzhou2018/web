const tabsView = {
  async addTab(title, content, singleton = true, closable = true) {
    if (singleton && this.activateTab(title)) {
      return;
    }
    
    $("#tabs").tabs("add", { title, content, closable });
  },

  closeTab(title) {
    $('#tabs').tabs("close", title);
  },

  getTab(title) {
    return $('#tabs').tabs("getTab", title);
  },

  activateTab(title) {
    let tab = this.getTab(title);
    if (tab) {
      $('#tabs').tabs("select", title)
      return true;
    }

    return false;
  }
};

function TabPanel() {
  this.show = async function(title) {
    const tab = this.tabParams();
    ejsParams = tab.params || {};

    let template = await utils.require(tab.url);
    let content = ejs.render(template, ejsParams);
    realTitle = title || tab.title;
    tabsView.addTab(realTitle, content);
    this.documentReady();
  }
  return this;
}