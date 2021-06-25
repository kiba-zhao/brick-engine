/**
 * @fileOverview 元数据管理器测试文件
 * @name metadata_manager.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import { MetadataManager,MODULE_KEY } from '../../lib/metadata_manager';
import faker from 'faker';

class ModelClass {}

describe('lib/metadata_manager', () => {

  it('MODULE_KEY', () => {
    expect(MODULE_KEY).toBe('brick-engine:MetadataManager');
  });

  describe('MetadataManager', () => {

    /**
     * @type MetadataManager
     */
    let manager;

    beforeEach(() => {
      manager = new MetadataManager();
    });

    describe('inject', () => {

      it('simple', ()=>{

        manager.inject(faker.datatype.datetime(),()=>{});
        manager.inject(()=>{},ModelClass);
        manager.inject(ModelClass,{});
        manager.inject({},faker.datatype.array());
        manager.inject(faker.datatype.array(),undefined);
        manager.inject(ModelClass,null);
        manager.inject(ModelClass,faker.datatype.string());
        manager.inject(ModelClass,faker.datatype.number());
        manager.inject(ModelClass,faker.datatype.datetime());
        manager.inject(ModelClass,Symbol());
        
      });

      it('fatal', ()=>{

        const WRONG_TARGET =
              `[${MODULE_KEY}] inject Error: wrong target`;
        
        expect(() => manager.inject(faker.datatype.string(),ModelClass)).toThrow(
          WRONG_TARGET
        );
        expect(() => manager.inject(faker.datatype.number(),ModelClass)).toThrow(
          WRONG_TARGET
        );
        expect(() => manager.inject(faker.datatype.boolean(),ModelClass)).toThrow(
          WRONG_TARGET
        );
        expect(() => manager.inject(null,ModelClass)).toThrow(
          WRONG_TARGET
        );        
        expect(() => manager.inject(undefined,ModelClass)).toThrow(
          WRONG_TARGET
        ); 
        expect(() => manager.inject(Symbol(),ModelClass)).toThrow(
          WRONG_TARGET
        ); 
        
      });

    });

    describe('extact',()=>{

      it('simple', ()=>{
        
        const target = ()=>{};
        const emptyRes = manager.extract(target);
        expect(emptyRes).toEqual([]);
        
        const metadata = faker.datatype.json();
        manager.inject(target,metadata);

        const res = manager.extract(target);
        expect(res).toEqual([metadata]);

        const metadataNext = faker.datatype.datetime();
        manager.inject(target,metadataNext);

        const resNext = manager.extract(target);
        expect(resNext).toEqual([metadata,metadataNext]);
        
      });

      it('fatal', ()=>{

        const WRONG_TARGET =
              `[${MODULE_KEY}] extract Error: wrong target`;

        expect(() => manager.extract(faker.datatype.string())).toThrow(
          WRONG_TARGET
        );
        expect(() => manager.extract(faker.datatype.number())).toThrow(
          WRONG_TARGET
        );
        expect(() => manager.extract(faker.datatype.boolean())).toThrow(
          WRONG_TARGET
        );
        expect(() => manager.extract(null)).toThrow(
          WRONG_TARGET
        );
        expect(() => manager.extract(undefined)).toThrow(
          WRONG_TARGET
        );
        expect(() => manager.extract(Symbol())).toThrow(
          WRONG_TARGET
        );

      });
      
    });

  });

});
