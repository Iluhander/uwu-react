import { checkErrStatus } from "../lib/esm/index.mjs";

test('Testing req enums', () => {
  expect(checkErrStatus(404)).toBe(true);
  expect(checkErrStatus(201)).toBe(false);
})