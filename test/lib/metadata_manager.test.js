/**
 * @fileOverview 元数据管理器测试文件
 * @name metadata_manager.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import { MODULE_KEY } from '../../lib/metadata_manager';
// import faker from 'faker';

describe('lib/metadata_manager', () => {

  it('MODULE_KEY', () => {
    expect(MODULE_KEY).toBe('brick-engine:MetadataManager');
  });

  // describe('MetadataManager', () => {

  //   /**
  //    * @type MetadataManager
  //    */
  //   let manager;

  //   beforeEach(() => {
  //     manager = new MetadataManager();
  //   });

  //   describe('inject', () => {


  //   });

  // });

});
