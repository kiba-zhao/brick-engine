/**
 * @fileOverview 提供器测试文件
 * @name provider.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import { jest } from '@jest/globals';
import { Provider, MODULE_KEY } from '../../lib/provider';
import faker from 'faker';

class ModelClass {}

describe('lib/provider', () => {

  it('MODULE_KEY', () => {
    expect(MODULE_KEY).toBe('brick-engine:Provider');
  });

  describe('Provider', () => {

    /**
   * @type Provider
   */
    let provider;

    beforeEach(() => {
      provider = new Provider();
    });

    describe('require', () => {

      it('success', async () => {
        const ids = [ 'string', 1, true, ModelClass ];
        const factories = [];
        const models = [];

        let i = 0;
        for (const id of ids) {
          const model = Symbol(++i);
          models.push(model);
          factories.push(jest.fn(() => model));
          provider.define(id, [], factories[factories.length - 1]);
        }

        const res = await provider.require(
          ...ids.map(_ => ({ id: _, required: true }))
        );

        for (const factory of factories) {
          expect(factory).toBeCalledTimes(1);
          expect(factory).toBeCalledWith();
        }
        expect(res).toEqual(models);
      });

      it('success with require first', async () => {
        const ids = [ 'string', 1, true, ModelClass ];
        const factories = [];
        const models = [];
        const handle = provider.require(
          ...ids.map(_ => ({ id: _, required: true }))
        );

        let i = 0;
        for (const id of ids) {
          const model = Symbol(++i);
          models.push(model);
          factories.push(jest.fn(() => model));
          provider.define(id, [], factories[factories.length - 1]);
        }

        const res = await handle;
        for (const factory of factories) {
          expect(factory).toBeCalledTimes(1);
          expect(factory).toBeCalledWith();
        }
        expect(res).toEqual(models);
      });

      it('require with dep', async () => {
        const ids = [ 'string', 1, true, ModelClass ];
        const factories = [];
        const models = [];

        let i = 0;
        for (const id of ids) {
          const model = Symbol(i);
          models.push(model);
          factories.push(jest.fn(() => model));
          provider.define(
            id,
            ids.slice(i + 1).map(_ => ({ id: _, required: true })),
            factories[factories.length - 1]
          );
          i++;
        }

        const res = await provider.require(
          ...ids.map(_ => ({ id: _, required: true }))
        );

        i = 0;
        for (const factory of factories) {
          expect(factory).toBeCalledTimes(1);
          expect(factory).toBeCalledWith(...models.slice(i + 1));
          i++;
        }
        expect(res).toEqual(models);
      });

      it('require with optional dep', async () => {
        const ids = [ 'string', 1, true, ModelClass ];
        const factories = [];
        const models = [];

        const handle = provider.require(
          ...ids.map(_ => ({ id: _, required: false }))
        );

        let i = 0;
        for (const id of ids) {
          const model = Symbol(i);
          models.push(model);
          factories.push(jest.fn(() => model));
          provider.define(
            id,
            ids.slice(i + 1).map(_ => ({ id: _, required: false })),
            factories[factories.length - 1]
          );
          i++;
        }

        let res = await handle;
        i = 0;
        for (const factory of factories) {
          expect(factory).not.toBeCalled();
          i++;
        }
        expect(res).toEqual(models.map(() => undefined));

        res = await provider.require(
          ...ids.map(_ => ({ id: _, required: false }))
        );
        i = 0;
        for (const factory of factories) {
          expect(factory).toBeCalledTimes(1);
          expect(factory).toBeCalledWith(...models.slice(i + 1));
          i++;
        }
        expect(res).toEqual(models);
      });

      it('require error', async () => {
        const ids = [ 'string', 1, true, ModelClass ];
        const factories = [];
        const models = [];
        const error = new Error();

        let i = 0;
        for (const id of ids) {
          const model = Symbol(++i);
          models.push(model);
          factories.push(
            jest.fn(() => {
              throw error;
            })
          );
          provider.define(id, [], factories[factories.length - 1]);
        }

        const res = provider.require(
          ...ids.map(_ => ({ id: _, required: true }))
        );
        await expect(res).rejects.toBe(error);

        i = 0;
        for (const factory of factories) {
          if (i > 0) {
            expect(factory).not.toBeCalled();
          } else {
            expect(factory).toBeCalledTimes(1);
            expect(factory).toBeCalledWith();
          }
          i++;
        }
      });

      it('require wrong dep', async () => {
        const error =
        `[${MODULE_KEY}] require Error: wrong deps argument`;

        await expect(provider.require(null)).rejects.toThrow(error);
        await expect(provider.require(undefined)).rejects.toThrow(error);
        await expect(provider.require(faker.datatype.number())).rejects.toThrow(
          error
        );
        await expect(provider.require(faker.datatype.string())).rejects.toThrow(
          error
        );
        await expect(provider.require(faker.datatype.boolean())).rejects.toThrow(
          error
        );
        await expect(provider.require(faker.datatype.array())).rejects.toThrow(
          error
        );
        await expect(provider.require({})).rejects.toThrow(error);
        await expect(provider.require(faker.datatype.datetime())).rejects.toThrow(
          error
        );
        await expect(provider.require(Symbol())).rejects.toThrow(error);
      });
    });

    describe('define', () => {
      it('define class', async () => {
        const ids = [ 'model1', 'model2', 'model3' ];
        const pre_optional = await provider.require(
          ...ids.map(_ => ({ id: _, required: false }))
        );

        for (const id of ids) {
          provider.define(id, [], ModelClass);
        }

        const required = await provider.require(
          ...ids.map(_ => ({ id: _, required: true }))
        );
        const optional = await provider.require(
          ...ids.map(_ => ({ id: _, required: false }))
        );

        expect(pre_optional).toHaveLength(ids.length);
        expect(required).toHaveLength(ids.length);
        expect(optional).toHaveLength(ids.length);
        for (const model of pre_optional) {
          expect(model).toBeUndefined();
        }
        for (const model of required) {
          expect(model).toBeInstanceOf(ModelClass);
        }
        for (const model of optional) {
          expect(model).toBeInstanceOf(ModelClass);
        }
      });

      it('define wrong', async () => {
        const WRONG_ID =
        `[${MODULE_KEY}] define Error: wrong id argument`;

        expect(() => provider.define()).toThrow(WRONG_ID);
        expect(() => provider.define(null)).toThrow(WRONG_ID);

        const WRONG_DEPS =
        `[${MODULE_KEY}] define Error: wrong deps argument`;

        expect(() => provider.define(faker.datatype.string())).toThrow(
          WRONG_DEPS
        );
        expect(() => provider.define(faker.datatype.string(), null)).toThrow(
          WRONG_DEPS
        );
        expect(() =>
          provider.define(faker.datatype.string(), faker.datatype.number())
        ).toThrow(WRONG_DEPS);
        expect(() =>
          provider.define(faker.datatype.string(), faker.datatype.datetime())
        ).toThrow(WRONG_DEPS);
        expect(() =>
          provider.define(faker.datatype.boolean(), faker.datatype.boolean())
        ).toThrow(WRONG_DEPS);
        expect(() =>
          provider.define(faker.datatype.number(), faker.datatype.array(1))
        ).toThrow(WRONG_DEPS);
        expect(() => provider.define(faker.datatype.datetime(), {})).toThrow(
          WRONG_DEPS
        );
        expect(() => provider.define(Symbol(), Symbol())).toThrow(WRONG_DEPS);

        const WRONG_FACTORY =
        `[${MODULE_KEY}] define Error: wrong factory argument`;

        expect(() => provider.define(faker.datatype.string(), [])).toThrow(
          WRONG_FACTORY
        );
        expect(() => provider.define(faker.datatype.string(), [], null)).toThrow(
          WRONG_FACTORY
        );
        expect(() =>
          provider.define(faker.datatype.string(), [], faker.datatype.number())
        ).toThrow(WRONG_FACTORY);
        expect(() =>
          provider.define(faker.datatype.string(), [], faker.datatype.string())
        ).toThrow(WRONG_FACTORY);
        expect(() =>
          provider.define(faker.datatype.string(), [], faker.datatype.boolean())
        ).toThrow(WRONG_FACTORY);
        expect(() =>
          provider.define(faker.datatype.string(), [], faker.datatype.array())
        ).toThrow(WRONG_FACTORY);
        expect(() =>
          provider.define(faker.datatype.string(), [], faker.datatype.datetime())
        ).toThrow(WRONG_FACTORY);
        expect(() => provider.define(faker.datatype.string(), [], {})).toThrow(
          WRONG_FACTORY
        );
        expect(() =>
          provider.define(faker.datatype.string(), [], Symbol())
        ).toThrow(WRONG_FACTORY);

        const id = faker.datatype.string();
        const WRONG_ID_DUPLICATE = `[${MODULE_KEY}] define Error: duplicate ${id.toString()}`;

        provider.define(id, [], () => {});
        expect(() => provider.define(id, [], () => {})).toThrow(
          WRONG_ID_DUPLICATE
        );

        const circular_id = faker.datatype.string();
        const WRONG_ID_CIRCULAR = `[${MODULE_KEY}] define Error: circular ${circular_id.toString()}`;

        expect(() => provider.define(circular_id, [{ id: circular_id }], () => {})).toThrow(
          WRONG_ID_CIRCULAR
        );
        expect(() => provider.define(circular_id, [{ id: circular_id, required: false }], () => {})).toThrow(
          WRONG_ID_CIRCULAR
        );

      });
    });

    describe('contains', () => {

      it('id found', () => {
        const id = faker.datatype.string();
        provider.define(id, [], () => {});

        const res = provider.contains(id);
        expect(res).toBeTruthy();
      });

      it('id not found', () => {
        const id = faker.datatype.string();

        const res = provider.contains(id);
        expect(res).toBeFalsy();
      });

    });

    describe('pendings', () => {

      it('empty', async () => {

        expect(Array.from(provider.pendings).length).toBe(0);

        const id = faker.datatype.string();
        provider.define(id, [{ id: faker.datatype.string() }], () => {});
        expect(Array.from(provider.pendings).length).toBe(0);

        const require_id = faker.datatype.string();
        const handle = provider.require({ id: require_id });
        provider.define(require_id, [], () => {});
        await handle;
        expect(Array.from(provider.pendings).length).toBe(0);

      });

      it('not empty', () => {

        const ids = [ faker.datatype.string(), faker.datatype.boolean(), faker.datatype.number() ];
        provider.require(...ids.map(_ => ({ id: _ })));

        expect(Array.from(provider.pendings)).toEqual(expect.arrayContaining(ids));
      });

    });

  });

});
