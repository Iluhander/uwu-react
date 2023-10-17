const possibleMaxSymbolsCount = 1e5;

export default function insertEStr(e, str) {
  if (
    parseInt(e.target.value.length, 10) -
      (e.target.selectionEnd - e.target.selectionStart) +
      str.length >
    (parseInt(e.target.getAttribute('maxlength'), 10) || possibleMaxSymbolsCount)
  ) {
    return;
  }

  e.target.value =
    e.target.value.substring(0, e.target.selectionStart) +
    str +
    e.target.value.substring(e.target.selectionEnd);
}
