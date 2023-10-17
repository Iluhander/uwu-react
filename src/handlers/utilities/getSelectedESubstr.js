export default function getSelectedESubstr(e) {
  return e.target.value.substr(e.target.selectionStart, e.target.selectionEnd);
}
