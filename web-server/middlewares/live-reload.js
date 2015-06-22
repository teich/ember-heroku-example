/* jshint node:true */

'use strict';

const liveReload = require('ember-cli-inject-live-reload');
const route      = require('koa-route');

// Inject live-reload if not in production
module.exports = function mountLiveReload(app) {
  process.env.EMBER_CLI_INJECT_LIVE_RELOAD_PORT    = '36629';
  process.env.EMBER_CLI_INJECT_LIVE_RELOAD_BASEURL = '/';

  /* jshint -W124 */
  app.use(route.get('/ember-cli-live-reload.js',
    function* serveLiveRelaod() {
      this.contentType = 'text/javascript';
      this.body = liveReload.dynamicScript();
    }));
};
