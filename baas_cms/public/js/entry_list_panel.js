class EntryListPanel extends TabPanel {
  constructor(templateParams) {
    templateParams.searchId = `search_id_${EntryListPanel.seed++}`;
    super(templateParams.title, 'views/entry_list_panel.ejs', templateParams);
    this.searchStatus = {
      enter: false,
      condtion: {}
    }
  }

  async onDocReady() {
    const pager = $(`#${this.templateParams.dgId}`).datagrid('getPager');
    pager.pagination({
      onSelectPage: this._onPageChanged.bind(this),
      onRefresh: this._onPageChanged.bind(this),
      onChangePageSize: this._onPageChanged.bind(this, 1)
    });

    $(`#${this.templateParams.searchId}`).click(this.search.bind(this));

    const opt = pager.pagination('options');
    this._reload(opt.pageNumber, opt.pageSize);
    this._getModel().addListener(this);
  }

  async search(e) {
    e.preventDefault();

    const cond = this.searchStatus.condtion = this._getSearchCondition();
    if (cond && Object.keys(cond).length !== 0) {
      this.searchStatus.enter = true;
    } else {
      this. searchStatus.enter = false;
    }

    const pager = $(`#${this.templateParams.dgId}`).datagrid('getPager');
    const opt = pager.pagination('options');
    this._reload(1, opt.pageSize);
  }

  onClosed() {
    this._getModel().removeListener(this);
  }

  onEntryCreated() {
    const pager = $(`#${this.templateParams.dgId}`).datagrid('getPager');
    const { pageNumber, pageSize } = pager.pagination('options');
    this._reload(pageNumber, pageSize);
  }

  onEntryUpdated() {
    const pager = $(`#${this.templateParams.dgId}`).datagrid('getPager');
    const { pageNumber, pageSize } = pager.pagination('options');
    this._reload(pageNumber, pageSize);
  }

  onEntryRemoved() {
    const pager = $(`#${this.templateParams.dgId}`).datagrid('getPager');
    const { total, pageNumber, pageSize } = pager.pagination('options');
    const realTotal = total - 1;
    const realPageNumber = (realTotal / pageSize) + ((realTotal % pageSize) ? 1 : 0);
    this._reload(pageNumber > realPageNumber ? realPageNumber : pageNumber, pageSize);
  }

  _getModel() { 
    throw new Error('_getModel method should be overriden!');
  }

  _getSearchCondition() {
    throw new Error('_getSearchCondition method should be overriden!');
  }

  _onPageChanged(pageNumber, pageSize) {
    this._reload(pageNumber, pageSize);
  }

  async _reload(pageNumber, pageSize) {
    const offset = ((pageNumber === 0 ? 1 : pageNumber) - 1) * pageSize;
    const condition = { _offset_: offset, _limit_: pageSize };
    if (this.searchStatus.enter) {
      Object.assign(condition, this.searchStatus.condtion);
    }

    if (this._fillExtraCondition) {
      this._fillExtraCondition(condition);
    }

    const { errorCode, errorMsg, entries, total } = await this._getModel().query(condition);

    if (errorCode === 0) {
      $(`#${this.templateParams.dgId}`).datagrid('loadData', entries);
      const pager = $(`#${this.templateParams.dgId}`).datagrid('getPager');
      pager.pagination({ total, pageNumber });
    } else {
      $(`#${this.templateParams.failMsgId}`).css('display', 'block');
      $(`#${this.templateParams.failCauseId}`).text(errorMsg);
    }
  }
};

EntryListPanel.seed = 1;