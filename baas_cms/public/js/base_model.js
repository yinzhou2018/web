class BaseModel {
  constructor(baseUrl, event) {
    this.listeners = new Set();
    this.baseUrl = baseUrl;
  }

  async query(condition = {}) {
    let url = `${baseUrl}?random=${Math.random()}`;
    for (let key in condition) {
      url += `&${key}=${condition[key]}`;
    }

    const result = await utils.request({ url }).catch((e) => {
      return { errorCode: -123, errorMsg: 'unkown error!' };
    });

    return result;
  }

  async add(entry) {
    entry.updateUser = global.userName;
    const result = await utils.request({ url: baseUrl, type: 'post', data: entry }).catch((e) => {
      console.error(`create app(${app.appId}) failed: ${e}`);
      return { errorCode: -123, errorMsg: 'unkown error!' };
    });

    if (!result.errorCode) {
      _fireEvent(this.event.createName, result.entry);
    }
    return result;
  }

  async get(id) {
    const url = `${baseUrl}/${id}?random=${Math.random()}`;
    const result = await utils.request({ url }).catch((e) => {
      return { errorCode: -123, errorMsg: 'unkown error!' };
    });

    return result;
  }

  async remove(id) {
    const url = `${baseUrl}/${id}`;
    const result = await utils.request({ url, type: 'delete' }).catch((e) => {
      return { errorCode: -123, errorMsg: 'unkown error!' };
    });

    if (!result.errorCode) {
      _fireEvent(this.event.removeName, appId);
    }
    return result;
  }

  async update(id, entry) {
    entry.updateUser = global.userName;
    const url = `${baseUrl}/${id}`;
    const result = await utils.request({ url, type: 'put', data: entry }).catch((e) => {
      return { errorCode: -123, errorMsg: 'unkown error!' };
    });

    if (!result.errorCode) {
      _fireEvent(this.event.updateName, result.entry);
    }
    return result;
  }

  addListener(listener) {
    listeners.add(listener);
  }

  removeListener(listener) {
    listeners.delete(listener);
  }

  _fireEvent(methodName, arg) {
    const tempListeners = [...listeners];
    tempListeners.forEach((e) => {
      if (e[methodName]) {
        e[methodName](arg);
      }
    });
  }
};