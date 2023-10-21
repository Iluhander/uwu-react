import commonKeyDownHandler from './commonKeyDownHandler.js';
import strHasBannedSymb from './utilities/strHasBannedSymb.js';
import getSelectedESubstr from './utilities/getSelectedESubstr.js';
import insertEStr from './utilities/insertEStr.js';

export default function extendedKeyDownHandler(e: any) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
    const type = 'text/plain';
    const blob = new Blob([getSelectedESubstr(e)], { type });
    const data = [new ClipboardItem({ [type]: blob })];

    navigator.clipboard.write(data);
    return '';
  }

  if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
    navigator.clipboard.readText().then((clipText) => {
      if (!strHasBannedSymb(clipText)) {
        return insertEStr(e, clipText);
      }
    });
    return '';
  }

  if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
    e.target.setSelectionRange(0, e.target.value.length);
    return '';
  }

  switch (e.key) {
    case 'Tab':
      return insertEStr(e, `  `);
    case 'Enter':
      return insertEStr(e, `\n`);
    default:
      commonKeyDownHandler(e);
  }
}
