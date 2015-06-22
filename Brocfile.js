/* jshint node:true */

'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const map      = require('broccoli-stew').map;
let   cdnURL   = process.env.CDN_URL;

// add trailing slash to CDN_URL if it needs one
if (cdnURL && cdnURL.charAt(cdnURL.length - 1) !== '/') {
  cdnURL = cdnURL + '/';
}

const appConfig = {
  es3Safe: false,

  fingerprint: {
    prepend: cdnURL,
  },

  sourcemaps: {
    enabled: true,
  },

  svgstore: {
    files: {
      sourceDirs: 'app/icons',
      outputFile: '/assets/icons.svg',
    },
  },

  // https://github.com/rwjblue/components-in-subdirs/commit/78e7ed2d
  vendorFiles: {
    'handlebars.js': null,
  },
};

const app = new EmberApp(appConfig);
app.import('bower_components/marked/lib/marked.js');
app.import('bower_components/normalize.css/normalize.css');
app.import('bower_components/rest-model/dist/rest-model.js');
app.import('bower_components/slug/slug.js');
app.import('vendor/debug.js');
app.import('vendor/share.js');
app.import('vendor/analytics.js');

// strip out the source map link, but leave source maps around
// so we can push to rollbar
const sourceMapRegex = /\/\/# sourceMappingURL=.*/;
const dist = map(app.toTree(), '*/*.js', function stripSourceMaps(content) {
  return content.replace(sourceMapRegex, '');
});

module.exports = dist;
