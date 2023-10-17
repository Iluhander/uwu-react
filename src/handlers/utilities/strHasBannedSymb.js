export default function strHasBannedSymb(str) {
  return str.indexOf('>') > 0 || str.indexOf('<') > 0 || str.indexOf('%') > 0;
}
