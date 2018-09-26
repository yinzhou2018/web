const utils = {

    require(path) {
      let ejs_pattern = /.ejs$/i;
      let js_pattern = /.js$/i;
      if (ejs_pattern.test(path)) {
        return this.request({url: path, dataType: ''});

      } else if (js_pattern.test(path)) {
        let scs = $('head').children('script');
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
          document.getElementsByTagName('head')[0].appendChild(script);
        })

        return pro;
      }

      return Promise.resolve();
    },

    request(args) {
      return new Promise((resolve, reject) => {
        const options = { 
          type: 'get', 
          dataType: 'json', 
          contentType: 'application/json; charset=utf-8',
          success(data) {
            resolve(data);
          },
          error(e) {
            reject(e);
          }
        };
        Object.assign(options, args);
        if (options.data) {
          options.data = JSON.stringify(options.data);
        }
        $.ajax(options);
      });
    }

  } //utils