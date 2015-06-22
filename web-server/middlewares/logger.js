'use strict';

/* jshint node: true */

let logger = require('logfmt').namespace({ source: 'canvas-web' });

module.exports = function* loggerMiddleware(next) {
  let data = {
    content_length: this.get('content-length'),
    content_type  : this.get('content-type'),
    ip            : this.get('x-forwarded-for'),
    method        : this.method,
    path          : this.originalUrl,
    request_id    : this.get('x-request-id'),
    time          : new Date().toISOString(),
  };

  let timer = logger.time('elapsed');

  yield next;

  data.status = this.status;
  timer.log(data);
};
