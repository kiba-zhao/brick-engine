/**
 * @fileOverview 定制配置文件
 * @name custom.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


const FIELD = {
  string: 'customstr',
  object: { customstr: 'customstr', customnum: 111 },
  number: 111,
  customstr: 'customstr',
  customnum: 111,
};

module.exports = () => {

  const exports = {};

  exports.field = { ...FIELD };

  exports.custom = 'custom';

  return exports;
};
