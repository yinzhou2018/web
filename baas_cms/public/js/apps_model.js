(function() {
  const listeners = new Set();
  const baseUrl = 'api/app';

  function _fireEvent(methodName, arg) {
    const tempListeners = [...listeners];
    tempListeners.forEach((e) => {
      if (e[methodName]) {
        e[methodName](arg);
      }
    });
  }

  const appsModel = {
    async query(condition = {}) {
      Object.assign(condition, {random: Math.random()});
      const result = await utils.request({url:baseUrl, type:'get', data:condition}).catch((e) => {
        console.error(`get apps error: ${e}`);
        return { errorCode: -123, errorMsg: 'unkown error!' };
      });

      return result;
    },

    async add(app) {
      app.updateUser = global.userName;
      const result = await utils.request({url:baseUrl, type:'post', data:app}).catch((e) => {
        console.error(`create app(${app.appId}) failed: ${e}`);
        return { errorCode: -123, errorMsg: 'unkown error!' };
      });

      if (!result.errorCode) {
        _fireEvent('onAppCreated', result.app);
      }
      return result;
    },

    get: async function(appId) {
      const url = `${baseUrl}/${appId}?random=${Math.random()}`;
      const result = await utils.request({url}).catch((e) => {
        console.error(`get app(${app.appId}) failed: ${e}`);
        return { errorCode: -123, errorMsg: 'unkown error!' };
      });

      return result;
    },

    async remove(appId) {
      const url = `${baseUrl}/${appId}`;
      const result = await utils.request({url, tpe: 'delete'}).catch((e) => {
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
      const url = `${baseUrl}/${app.appId}`;
      const result = await utils.request({url, type: 'put', data: app}).catch((e) => {
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