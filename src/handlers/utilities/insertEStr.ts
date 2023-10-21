import { ChangeEvent } from "react";

const possibleMaxSymbolsCount = '1e5';

export default function insertEStr(e: ChangeEvent<HTMLInputElement>, str: string) {
  const selectionStart = e.target.selectionStart || 0;
  const selectionEnd = e.target.selectionEnd || 0;

  if (
    parseInt(`${e.target.value.length}`, 10) -
      (selectionEnd - selectionStart) +
      str.length >
    (parseInt(e.target.getAttribute('maxlength') || possibleMaxSymbolsCount, 10))
  ) {
    return;
  }

  e.target.value =
    e.target.value.substring(0, selectionStart) +
    str +
    e.target.value.substring(selectionEnd);
}
