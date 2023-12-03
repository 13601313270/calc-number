import allMethod from './method/index'

export default function (runStr) {
  let resultArr = [];
  let split = 0;
  while (split < runStr.length) {
    if (Object.keys(allMethod).includes(runStr.slice(split, split + 3))) {
      resultArr.push(runStr.slice(split, split + 3))
      split += 3;
    } else if (['**'].includes(runStr.slice(split, split + 2))) {
      resultArr.push(runStr.slice(split, split + 2))
      split += 2;
    } else if (['+', '-', '*', '/', '(', ')'].includes(runStr[split])) {
      resultArr.push(runStr[split]);
      split++;
    } else if (runStr[split].match(/\d/)) {
      let numberStr = runStr[split];
      for (let i = split + 1; i < runStr.length; i++) {
        if (runStr[i].match(/\d/) || runStr[i] === '.') {
          numberStr += runStr[i];
          split++;
        } else {
          break;
        }
      }
      resultArr.push(numberStr)
      split++;
    } else {
      split++;
    }
  }
  return resultArr
}