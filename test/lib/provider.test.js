/**
 * @fileOverview 提供器测试文件
 * @name provider.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

import {jest} from '@jest/globals';
import { Provider } from '../../lib/provider';
import faker from 'faker';

class ModelClass {
}

describe('lib/provider', () => {

  /**
   * @type Provider
   */
  let provider;

  beforeEach(()=>{
    provider = new Provider();
  });
  
  describe('require',()=>{

    it('success',async ()=>{

      const ids = [ 'string', 1, true, ModelClass]; 
      const factories = [];
      const models = [];

      let i = 0;
      for (const id of ids) {
        const model = Symbol(++i);
        models.push(model);
        factories.push(jest.fn(() => model));
        provider.define(id, [], factories[factories.length - 1]);
      }

      const res = await provider.require(...ids.map(_=>({id:_,required:true})));

      for(let factory of factories) {
        expect(factory).toBeCalledTimes(1);
        expect(factory).toBeCalledWith();
      }
      expect(res).toEqual(models);
    });

    it('success with require first',async ()=>{

      const ids = [ 'string', 1, true, ModelClass]; 
      const factories = [];
      const models = [];
      const handle = provider.require(...ids.map(_=>({id:_,required:true})));
      
      let i = 0;
      for (const id of ids) {
        const model = Symbol(++i);
        models.push(model);
        factories.push(jest.fn(() => model));
        provider.define(id, [], factories[factories.length - 1]);
      }

      const res = await handle;
      for(let factory of factories) {
        expect(factory).toBeCalledTimes(1);
        expect(factory).toBeCalledWith();
      }
      expect(res).toEqual(models);
    });

    it('require with dep',async ()=>{
      
      const ids = [ 'string', 1, true, ModelClass]; 
      const factories = [];
      const models = [];

      let i = 0;
      for (const id of ids) {
        const model = Symbol(i);
        models.push(model);
        factories.push(jest.fn(() => model));
        provider.define(id, ids.slice(i + 1).map(_=>({id:_,required:true})), factories[factories.length - 1]);
        i++;
      }

      const res = await provider.require(...ids.map(_=>({id:_,required:true})));

      i=0;
      for(let factory of factories) {
        expect(factory).toBeCalledTimes(1);
        expect(factory).toBeCalledWith(...models.slice(i+1));
        i++;
      }
      expect(res).toEqual(models);
      
    });

    it('require with optional dep', async () => {

      const ids = ['string', 1, true, ModelClass];
      const factories = [];
      const models = [];

      const handle = provider.require(...ids.map(_ => ({ id: _, required: false })));
      
      let i = 0;
      for (const id of ids) {
        const model = Symbol(i);
        models.push(model);
        factories.push(jest.fn(() => model));
        provider.define(id, ids.slice(i + 1).map(_ => ({ id: _, required: false })), factories[factories.length - 1]);
        i++;
      }


      let res = await handle;
      i = 0;
      for (let factory of factories) {
        expect(factory).not.toBeCalled();
        i++;
      }
      expect(res).toEqual(models.map(_=>undefined));

      res = await provider.require(...ids.map(_ => ({ id: _, required: false })));
      i = 0;
      for (let factory of factories) {
        expect(factory).toBeCalledTimes(1);
        expect(factory).toBeCalledWith(...models.slice(i + 1));
        i++;
      }
      expect(res).toEqual(models);      

    });

    it('require error',async ()=>{
      
      const ids = [ 'string', 1, true, ModelClass]; 
      const factories = [];
      const models = [];
      const error = new Error();

      let i = 0;
      for (const id of ids) {
        const model = Symbol(++i);
        models.push(model);
        factories.push(jest.fn(() => { throw error; }));
        provider.define(id, [], factories[factories.length - 1]);
      }

      const res = provider.require(...ids.map(_=>({id:_,required:true})));
      await expect(res).rejects.toBe(error);

      i=0;
      for(let factory of factories) {
        if (i>0) {
          expect(factory).not.toBeCalled();
        }else{
          expect(factory).toBeCalledTimes(1);
          expect(factory).toBeCalledWith();
        }
        i++;
      }
      
    });

    it('require wrong dep',async ()=>{

      const error = '[brick-engine Provider] require Error: wrong deps argument';
      
      await expect(provider.require(null)).rejects.toThrow(error);
      await expect(provider.require(undefined)).rejects.toThrow(error);
      await expect(provider.require(faker.datatype.number())).rejects.toThrow(error);
      await expect(provider.require(faker.datatype.string())).rejects.toThrow(error);
      await expect(provider.require(faker.datatype.boolean())).rejects.toThrow(error);
      await expect(provider.require(faker.datatype.array())).rejects.toThrow(error);
      await expect(provider.require({})).rejects.toThrow(error);
      await expect(provider.require(faker.datatype.datetime())).rejects.toThrow(error);
      await expect(provider.require(Symbol())).rejects.toThrow(error);
      
    });
    
  });

  describe('define',()=>{

    it('define class',async ()=>{

      const ids = [ 'model1', 'model2', 'model3' ];
      const pre_optional = await provider.require(...ids.map(_=>({id:_,required:false})));
      
      for (const id of ids) {
        provider.define(id, [], ModelClass);
      }

      const required = await provider.require(...ids.map(_=>({id:_,required:true})));
      const optional = await provider.require(...ids.map(_=>({id:_,required:false})));

      expect(pre_optional).toHaveLength(ids.length);
      expect(required).toHaveLength(ids.length);
      expect(optional).toHaveLength(ids.length);
      for(let model of pre_optional) {
        expect(model).toBeUndefined();
      }
      for(let model of required) {
        expect(model).toBeInstanceOf(ModelClass);
      }
      for(let model of optional) {
        expect(model).toBeInstanceOf(ModelClass);
      }

    });

    it('define wrong',async ()=>{

      const WRONG_ID = '[brick-engine Provider] define Error: wrong id argument';
      
      expect(()=>provider.define()).toThrow(WRONG_ID);
      expect(()=>provider.define(null)).toThrow(WRONG_ID);

      const WRONG_DEPS = '[brick-engine Provider] define Error: wrong deps argument';
      
      expect(()=>provider.define(faker.datatype.string())).toThrow(WRONG_DEPS);
      expect(()=>provider.define(faker.datatype.string(),null)).toThrow(WRONG_DEPS);
      expect(()=>provider.define(faker.datatype.string(),faker.datatype.number())).toThrow(WRONG_DEPS);
      expect(()=>provider.define(faker.datatype.string(),faker.datatype.datetime())).toThrow(WRONG_DEPS);
      expect(()=>provider.define(faker.datatype.boolean(),faker.datatype.boolean())).toThrow(WRONG_DEPS);
      expect(()=>provider.define(faker.datatype.number(),faker.datatype.array(1))).toThrow(WRONG_DEPS);
      expect(()=>provider.define(faker.datatype.datetime(),{})).toThrow(WRONG_DEPS);
      expect(()=>provider.define(Symbol(),Symbol())).toThrow(WRONG_DEPS);

      const WRONG_FACTORY = '[brick-engine Provider] define Error: wrong factory argument';

      expect(()=>provider.define(faker.datatype.string(),[])).toThrow(WRONG_FACTORY);
      expect(()=>provider.define(faker.datatype.string(),[],null)).toThrow(WRONG_FACTORY);
      expect(()=>provider.define(faker.datatype.string(),[],faker.datatype.number())).toThrow(WRONG_FACTORY);
      expect(()=>provider.define(faker.datatype.string(),[],faker.datatype.string())).toThrow(WRONG_FACTORY);
      expect(()=>provider.define(faker.datatype.string(),[],faker.datatype.boolean())).toThrow(WRONG_FACTORY);
      expect(()=>provider.define(faker.datatype.string(),[],faker.datatype.array())).toThrow(WRONG_FACTORY);
      expect(()=>provider.define(faker.datatype.string(),[],faker.datatype.datetime())).toThrow(WRONG_FACTORY);
      expect(()=>provider.define(faker.datatype.string(),[],{})).toThrow(WRONG_FACTORY);
      expect(()=>provider.define(faker.datatype.string(),[],Symbol())).toThrow(WRONG_FACTORY);

      const WRONG_1 = '';
    });
    
  });

});

