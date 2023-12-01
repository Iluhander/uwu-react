import insertEStr from './utilities/insertEStr.js';
const allowedKeys = '\n qwertyuiopQWERTYUIOPASDFGHJKLZXCVBNM[]asdfghjkl:;zxcvbnm,.`1234567890-=!$^&*?(){}#|/_+йцукеёнгшщзхъфывапролджэячсмитьбюЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ';
export default function commonKeyDownHandler(e) {
    const { selectionStart, selectionEnd } = e.target;
    const str = e.target.value;
    if (e.key === 'Backspace') {
        if (selectionStart === selectionEnd && !selectionStart) {
            return;
        }
        e.target.value = str.substring(0, selectionStart - 1) + str.substring(selectionEnd);
        e.target.setSelectionRange(selectionStart - 1, selectionStart - 1);
    }
    else if (e.key === 'ArrowLeft') {
        if (selectionStart) {
            e.target.setSelectionRange(selectionStart - 1, selectionStart - 1);
        }
    }
    else if (e.key === 'ArrowRight') {
        if (selectionStart) {
            e.target.setSelectionRange(selectionStart + 1, selectionStart + 1);
        }
    }
    else if (allowedKeys.indexOf(e.key) !== -1) {
        insertEStr(e, e.key);
        e.target.setSelectionRange(selectionStart + 1, selectionStart + 1);
    }
}
