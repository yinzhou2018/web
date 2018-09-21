const utils = {

    require(path) {
      let scs = $('script');
      for (let i = 0; i < scs.length; ++i) {
        let element = scs.get(i);
        if (element.src.indexOf(path) !== -1) {
          return Promise.resolve();
        }
      }

      let pro = new Promise((resolve, reject) => {
        var done = false;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.language = 'javascript';
        script.src = path;
        script.onload = script.onreadystatechange = function() {
          if (!done && (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete')) {
            done = true;
            script.onload = script.onreadystatechange = null;
            resolve();
          }
        }
        document.getElementsByTagName("head")[0].appendChild(script);
      })

      return pro;
    },

    request(url, type = 'get', data) {
      return new Promise((resolve, reject) => {
        $.ajax({
          url,
          type,
          data,
          dataType: 'json',
          success(data) {
            resolve(data);
          },
          error() {
            reject();
          }
        })
      });
    }

  } //utils