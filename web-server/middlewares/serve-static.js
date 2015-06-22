'use strict';

/* jshint node:true */

let path     = require('path');
let redirect = require('./redirect-www');
let send     = require('koa-send');
let isProd   = process.env.NODE_ENV === 'production';
let maxAge   = isProd ? require('ms')('1y') : 0;
let root     = require('path').resolve(path.join(__dirname, '../../dist'));

module.exports = function serveStatic(app) {
  app.use(function* setAccessControl(next) {
    this.set('access-control-allow-origin', '*');
    yield next;
  });

  app.use(function* serve(next) {
    if (this.method === 'HEAD' || this.method === 'GET') {
      if (yield send(this, this.path, { maxage: maxAge, root: root })) {
        return;
      }
    }

    yield* next;
  });

  app.use(function* setAccessControl(next) {
    this.remove('access-control-allow-origin');
    yield next;
  });

  app.use(redirect);

  app.use(function* getAny(next) {
    if (/\./.test(this.originalUrl) ||
        this.method !== 'GET' ||
        !this.accepts('html')) {
      yield next;
    } else {
      yield send(this, path.join(__dirname, '../../dist/index.html'));
    }
  });
};
