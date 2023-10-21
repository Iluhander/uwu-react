import { areEqualShallow } from '../lib/esm/index.mjs';

test('Testing shallow objs comparison', () => {
  expect(areEqualShallow({
    a: 1
  }, {
    a: 1
  })).toBe(true);

  const someObj = { x: 1 };
  expect(areEqualShallow({
    a: 1,
    someObj
  }, {
    a: 1,
    someObj
  })).toBe(true);

  expect(areEqualShallow({
    a: 1,
    someObj
  }, {
    a: 1,
  })).toBe(false);

  expect(areEqualShallow({
    a: 1
  }, {
    a: 1,
    someObj
  })).toBe(false);
});
