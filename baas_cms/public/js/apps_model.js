(function() {
  const listeners = new Set();

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
    async query(condition) {
      let url = `api/app?random=${Math.random()}`;
      if (condition) {
        for (let key in condition) {
          url += `&${key}=${condition[key]}`;
        }
      }

      const result = await utils.request(url).catch((e) => {
        console.error(`get apps error: ${e}`);
        return { errorCode: -123, errorMsg: 'unkown error!' };
      });

      return result;
    },

    async add(app) {
      app.updateUser = global.userName;
      const url = 'api/app';
      const result = await utils.request(url, 'post', app).catch((e) => {
        console.error(`create app(${app.appId}) failed: ${e}`);
        return { errorCode: -123, errorMsg: 'unkown error!' };
      });

      if (!result.errorCode) {
        _fireEvent('onAppCreated', result.app);
      }
      return result;
    },

    get: async function(appId) {
      const url = `api/app/${appId}?random=${Math.random()}`;
      const result = await utils.request(url).catch((e) => {
        console.error(`get app(${app.appId}) failed: ${e}`);
        return { errorCode: -123, errorMsg: 'unkown error!' };
      });

      return result;
    },

    async remove(appId) {
      const url = `api/app/${appId}`;
      const result = await utils.request(url, 'delete').catch((e) => {
        console.error(`delete app(${app.appId}) failed: ${e}`);
        return { errorCode: -123, errorMsg: 'unkown error!' };
      });

      if (!result.errorCode) {
        _fireEvent('onAppRemoved', appId);
      }
      return result;
    },

    async update(app) {
      app.updateUser = global.userName;
      const url = `api/app/${app.appId}`;
      const result = await utils.request(url, 'put', app).catch((e) => {
        console.error(`update app(${app.appId}) failed: ${e}`);
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