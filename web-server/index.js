/* jshint node:true */

'use strict';

const compression = require('koa-compress');
const helmet      = require('koa-helmet');
const koa         = require('koa');
const liveReload  = require('./middlewares/live-reload');
const logger      = require('./middlewares/logger');
const serveStatic = require('./middlewares/serve-static');
const ssl         = require('koa-ssl');
const teamster    = require('teamster');

const app         = koa();
const isProd      = process.env.NODE_ENV === 'production';
const port        = process.env.WEB_PORT || process.env.PORT;

app.use(logger);
app.use(compression());

if (isProd) {
  app.use(helmet.defaults());
  app.use(ssl({ trustProxy: true, disallow: function disallow(ctx) {
    ctx.redirect(`https://${ctx.get('host')}${ctx.originalUrl}`);
  }, }));
} else {
  liveReload(app);
}

serveStatic(app);

teamster.runServer(app.callback(), {
  fork      : isProd,
  numWorkers: parseInt(process.env.NUM_WORKERS, 10) || 1,
  port      : port,
});
