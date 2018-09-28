const utils = {

    require(path) {
      let ejs_pattern = /.ejs$/i;
      let js_pattern = /.js$/i;
      if (ejs_pattern.test(path)) {
        return this.request({ url: path, dataType: '' });

      } else if (js_pattern.test(path)) {
        let scs = $('head').children('script');
        for (let i = 0; i < scs.length; ++i) {
          let element = scs.get(i);
          if (element.src.indexOf(path) !== -1) {
            return Promise.resolve();
          }
        }

        let correctPath = path;
        if (!/^http[s]?:\/\//i.test(correctPath) && correctPath[0] !== '/') {
          correctPath = '/' + path;
        }

        let pro = new Promise((resolve, reject) => {
          var done = false;
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.language = 'javascript';
          script.src = correctPath;
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

        let url = args.url;
        if (!/^http[s]?:\/\//i.test(url) && url[0] !== '/') {
          url = '/' + args.url;
        }
        options.url = url;

        if (options.data) {
          options.data = JSON.stringify(options.data);
        }
        $.ajax(options);
      });
    },

    object2Array(obj) {
      const ary = [];
      for (const key in obj) {
        ary.push(obj[key]);
      }
      return ary;
    }

  } //utils