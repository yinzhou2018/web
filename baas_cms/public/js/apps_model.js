(function() {
  var listeners = new Set();

  function _fireEvent(methodName, arg) {
    let tempListeners = new Set();
    listeners.forEach((e) => tempListeners.add(e));
    tempListeners.forEach((e) => {
      if (e[methodName]) {
        e[methodName](arg);
      }
    });
  }

  const appsModel = {
    async query(condition, offset, limit) {
      let url = `api/app?`;
      for (let key in condition) {
        url += `${key}=${condition[key]}&`;
      }
      url += `offset=${offset}&limit=${limit}&random=${Math.random()}`;

      let result = await utils.request(url).catch((e) => {
        console.error(`get apps error: ${e.stack}`);
        return { errorCode: -123, errorMsg: 'unkown error!' };
      });

      return result;
    },

    async add(app) {
      app.updateUser = global.userName;
      let url = 'api/app';
      let result = await utils.request(url, 'post', app).catch((e) => {
        console.error(`create app(${app.appId}) failed: ${e.stack}`);
        return { errorCode: -123, errorMsg: 'unkown error!' };
      });

      if (!result.errorCode) {
        _fireEvent('onAppCreated', result.app);
      }
      return result;
    },

    get: async function(appId) {
      let url = `api/app/${appId}`;
      let result = await utils.request(url).catch((e) => {
        console.error(`get app(${app.appId}) failed: ${e.stack}`);
        return { errorCode: -123, errorMsg: 'unkown error!' };
      });

      return result;
    },

    async remove(appId) {
      let url = `api/app/${appId}`;
      let result = await utils.request(url, 'delete').catch((e) => {
        console.error(`delete app(${app.appId}) failed: ${e.stack}`);
        return { errorCode: -123, errorMsg: 'unkown error!' };
      });

      if (!result.errorCode) {
        _fireEvent('onAppRemoved', appId);
      }
      return result;
    },

    async update(app) {
      app.updateUser = global.userName;
      let url = `api/app/${app.appId}`;
      let result = await utils.request(url, 'put', app).catch((e) => {
        console.error(`update app(${app.appId}) failed: ${e.stack}`);
        return { errorCode: -123, errorMsg: 'unkown error!' };
      });

      if (!result.errorCode) {
        _fireEvent('onAppUpdated', result.app);
      }
      return result;
    },

    addListener(listener) {
      listeners.add(listener);
    },

    removeListener(listener) {
      listeners.delete(listener);
    }
  };

  window.appsModel = appsModel;
}())