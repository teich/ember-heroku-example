/* jshint node:true */

'use strict';

module.exports = function* redirectWWW(next) {
  if (process.env.NODE_ENV === 'production' &&
      process.env.SKIP_WWW_REDIRECT !== 'true' &&
      !/^www\./.test(this.host)) {
    return this.redirect(`${this.protocol}://www.${this.host}${this.originalUrl}`);
  }

  yield next;
};
