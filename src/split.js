import allMethod from './method/index'
import allAfterMethod from './afterMethod/index'

export default function (runStr) {
  let resultArr = [];
  let split = 0;
  while (split < runStr.length) {
    if (['**'].includes(runStr.slice(split, split + 2))) {
      resultArr.push(runStr.slice(split, split + 2))
      split += 2;
    } else if ((runStr[split].match(/-/) && resultArr.length === 0 && runStr[split + 1] && runStr[split + 1].match(/\d/)) || runStr[split].match(/\d/)) {
      let numberStr = runStr[split];
      for (let i = split + 1; i < runStr.length; i++) {
        const kxMatch = runStr.slice(i).match(/^e(\+|-)\d+/)// 科学计数法
        if (kxMatch) {
          numberStr += kxMatch[0];
          split += kxMatch[0].length;
        }
        else if (runStr[i].match(/\d/) || runStr[i] === '.') {
          numberStr += runStr[i];
          split++;
        } else {
          break;
        }
      }
      resultArr.push(numberStr)
      split++;
    } else if (['+', '-', '*', '/', '(', ')', '%'].includes(runStr[split])) {
      resultArr.push(runStr[split]);
      split++;
    } else if (runStr[split] === '.') {
      // 后置运算例如(23.412).toFixed(2)
      resultArr.push(runStr[split]);
      split++;
    } else {
      const match = Object.keys(allMethod).find(v => v === runStr.slice(split, split + v.length));
      const matchAfter = Object.keys(allAfterMethod).find(v => v === runStr.slice(split, split + v.length));
      if (match) {
        resultArr.push(runStr.slice(split, split + match.length))
        split += 3;
      } else if (matchAfter) {
        resultArr.push(runStr.slice(split, split + matchAfter.length))
        split += 3;
      } else {
        split++;
      }
    }
  }
  return resultArr
}