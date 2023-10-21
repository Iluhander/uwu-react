export default function strHasBannedSymb(str: string) {
  return str.indexOf('>') > 0 || str.indexOf('<') > 0 || str.indexOf('%') > 0;
}
