(function() {
  var apps = [];
  var ready = false;

  async function waitForReady() {
    if (!ready) {
      try {
        apps = await request('api/apps');
        ready = true;
      } catch (e) {
        console.error('Request apps failed!');
      }
    }
  }

  const appsModel = {
    async getAll() {
      await waitForReady();
      return apps;
    },

    get(appId) {
      for (let i = 0; i < apps.length; ++i) {
        if (apps[i].appId === appId) {
          return apps[i];
        }
      }

      return null;
    }
  };

  window.appsModel = appsModel;
}())