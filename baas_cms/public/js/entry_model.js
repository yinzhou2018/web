class EntryModel {
  constructor(className, constPart = {}) {
    this.listeners = new Set();
    this.baseUrl = `api/classes/${className}`;
    this.constPart = constPart;
  }

  async query(condition = {}) {
    const url = `${this.baseUrl}?random=${Math.random()}&cond=${JSON.stringify(condition)}`;
    const result = await utils.request({ url }).catch((e) => {
      return { errorCode: -123, errorMsg: 'unkown error!' };
    });

    return result;
  }

  async add(entry) {
    Object.assign(entry, this.constPart);
    const result = await utils.request({ url: this.baseUrl, type: 'post', data: entry }).catch((e) => {
      return { errorCode: -123, errorMsg: 'unkown error!' };
    });

    if (!result.errorCode) {
      entry.id = +result.id;
      this._fireEvent('onEntryCreated', entry);
    }
    return result;
  }

  async remove(id) {
    const url = `${this.baseUrl}?cond=${JSON.stringify({id:{op:'=',value:id}})}`;
    const result = await utils.request({ url, type: 'delete' }).catch((e) => {
      return { errorCode: -123, errorMsg: 'unkown error!' };
    });

    if (!result.errorCode) {
      this._fireEvent('onEntryRemoved', +id);
    }
    return result;
  }

  async update(id, entry) {
    Object.assign(entry, this.constPart);
    const url = `${this.baseUrl}?cond=${JSON.stringify({id:{op:'=',value:id}})}`;
    const result = await utils.request({ url, type: 'put', data: entry }).catch((e) => {
      return { errorCode: -123, errorMsg: 'unkown error!' };
    });

    if (!result.errorCode) {
      entry.id = +id;
      this._fireEvent('onEntryUpdated', entry);
    }
    return result;
  }

  addListener(listener) {
    this.listeners.add(listener);
  }

  removeListener(listener) {
    this.listeners.delete(listener);
  }

  _fireEvent(methodName, arg) {
    const tempListeners = [...this.listeners];
    tempListeners.forEach((listener) => {
      if (listener[methodName]) {
        listener[methodName](arg);
      }
    });
  }
};