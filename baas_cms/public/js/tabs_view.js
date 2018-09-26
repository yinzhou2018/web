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
    const tab = this.getTab(title);
    if (tab) {
      $('#tabs').tabs("select", title)
      return true;
    }

    return false;
  },

  addCloseEventListener(listener) {
    if (!this.closeEventRegistered) {
      $("#tabs").tabs({ onClose: this._closeEventFired.bind(this) });
      this.closeEventRegistered = true;
    }
    this.closeListeners.add(listener);
  },

  removeCloseEventListener(listener) {
    this.closeListeners.delete(listener);
  },

  _closeEventFired(title, index) {
    let tempListners = new Set();
    this.closeListeners.forEach((e) => tempListners.add(e));
    tempListners.forEach((e) => e.closeEventFired(title, index));
  },

  closeEventRegistered: false,
  closeListeners: new Set()
};

class TabPanel {
  constructor(title, templatePath, templateParams = {}) {
    this.title = title;
    this.templatePath = templatePath;
    this.templateParams = templateParams;
  }

  async show() {
    const template = await utils.require(this.templatePath);
    let content = ejs.render(template, this.templateParams);

    tabsView.addTab(this.title, content);
    tabsView.addCloseEventListener(this);

    if (this.onDocReady) {
      this.onDocReady();
    }
  }

  closeEventFired(title, index) {
    if (title === this.title) {
      tabsView.removeCloseEventListener(this);
      if (this.onClosed) {
        this.onClosed();
      }
    }
  }
};