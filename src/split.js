export default function (runStr) {
  // 1+2
  // let allKeyWord = ['**']
  let resultArr = [];
  let split = 0;
  while (split < runStr.length) {
    if (['sin', 'cos'].includes(runStr.slice(split, split + 3))) {
      resultArr.push(runStr.slice(split, split + 3))
      split += 2;
    } else if (['**'].includes(runStr.slice(split, split + 2))) {
      resultArr.push(runStr.slice(split, split + 2))
      split++;
    } else if (['+', '-', '*', '/', '(', ')'].includes(runStr[split])) {
      resultArr.push(runStr[split]);
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
    }

    split++;
  }
  return resultArr
}