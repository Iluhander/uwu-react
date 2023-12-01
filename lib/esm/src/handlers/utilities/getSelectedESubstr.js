export default function getSelectedESubstr(e) {
    if (!e.target.selectionStart || !e.target.selectionEnd) {
        return '';
    }
    return e.target.value.substr(e.target.selectionStart, e.target.selectionEnd);
}
