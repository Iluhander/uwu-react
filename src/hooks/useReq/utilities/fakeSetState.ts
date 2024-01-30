import { MutableRefObject, SetStateAction } from "react";

export default function fakeSetState(
  input: SetStateAction<any>,
  ref: MutableRefObject<any>,
  key: string
) {
  if (typeof input === 'function') {
    ref.current[key] = (input as any)(ref.current[key]);
  } else {
    ref.current[key] = input;
  }
}
