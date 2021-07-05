/**
 * @fileOverview 元数据代码测试
 * @name metadata.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import { extract, inject, MODULE_KEY } from '../../lib/metadata';
import faker from 'faker';

class ModelClass {}

describe('lib/metadata_manager', () => {

  it('MODULE_KEY', () => {
    expect(MODULE_KEY).toBe('brick-engine:Metadata');
  });

  describe('Metadata', () => {

    describe('inject', () => {

      it('simple', () => {

        inject(faker.datatype.datetime(), () => {});
        inject(() => {}, ModelClass);
        inject(ModelClass, {});
        inject({}, faker.datatype.array());
        inject(faker.datatype.array(), undefined);
        inject(ModelClass, null);
        inject(ModelClass, faker.datatype.string());
        inject(ModelClass, faker.datatype.number());
        inject(ModelClass, faker.datatype.datetime());
        inject(ModelClass, Symbol());

      });

      it('fatal', () => {

        const WRONG_TARGET =
              `[${MODULE_KEY}] inject Error: wrong target`;

        expect(() => inject(faker.datatype.string(), ModelClass)).toThrow(
          WRONG_TARGET
        );
        expect(() => inject(faker.datatype.number(), ModelClass)).toThrow(
          WRONG_TARGET
        );
        expect(() => inject(faker.datatype.boolean(), ModelClass)).toThrow(
          WRONG_TARGET
        );
        expect(() => inject(null, ModelClass)).toThrow(
          WRONG_TARGET
        );
        expect(() => inject(undefined, ModelClass)).toThrow(
          WRONG_TARGET
        );
        expect(() => inject(Symbol(), ModelClass)).toThrow(
          WRONG_TARGET
        );

      });

    });

    describe('extact', () => {

      it('simple', () => {

        const target = () => {};
        const emptyRes = extract(target);
        expect(emptyRes).toEqual([]);

        const metadata = faker.datatype.json();
        inject(target, metadata);

        const res = extract(target);
        expect(res).toEqual([ metadata ]);

        const metadataNext = faker.datatype.datetime();
        inject(target, metadataNext);

        const resNext = extract(target);
        expect(resNext).toEqual([ metadata, metadataNext ]);

      });

      it('fatal', () => {

        const WRONG_TARGET =
              `[${MODULE_KEY}] extract Error: wrong target`;

        expect(() => extract(faker.datatype.string())).toThrow(
          WRONG_TARGET
        );
        expect(() => extract(faker.datatype.number())).toThrow(
          WRONG_TARGET
        );
        expect(() => extract(faker.datatype.boolean())).toThrow(
          WRONG_TARGET
        );
        expect(() => extract(null)).toThrow(
          WRONG_TARGET
        );
        expect(() => extract(undefined)).toThrow(
          WRONG_TARGET
        );
        expect(() => extract(Symbol())).toThrow(
          WRONG_TARGET
        );

      });

    });

  });

});
