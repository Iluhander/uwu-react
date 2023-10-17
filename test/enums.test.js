import { checkErrStatus } from "../index";

test('Testing req enums', () => {
  expect(checkErrStatus(404)).toBe(true);
  expect(checkErrStatus(201)).toBe(false);
})