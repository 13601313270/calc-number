import split from "./split";
class runObj {
  constructor(type, data) {
    this.type = type;
    this.data = data;
  }
  run() {
    if (this.type === '+') {
      const BigNumber = require('bignumber.js')
      return BigNumber.sum(this.data[0], this.data[1]).toNumber()
    } else if (this.type === '-') {

    }
  }
}

//a 运算符 b
// 运算符(子运算)
// 1 + 1 * 2 - 3 * 2

// 1+2
// const temp1 = new runObj('+', [1, 2])
// temp1.run()// 3



// new runObj('**', [2, 3])

// // (12+22)*2
// new runObj('*', [(
//   new runObj('+', [12, 22])
// ), 2])

function numberCalc(runStr) {
  // 第一步分词
  let resultArr = split(runStr);// '1+2'    =>   ['1', '+', '2']
  // 第二步
  // ['1', '+', '2'] => { runType: '+', data: [{runType: 'number', data: 1},'2']}
  const temp = [[]];
  // 1 + 1 * 2 - 3 * 2
  // [1 ,+ ,1, * ,2, - ,3, * ,2]
  // [[1] , [+] ,[1, * ,2], [-] ,[3, * ,2]]
  for (let i = 0; i < resultArr.length; i++) {
    if (resultArr[i].match(/\d+/) || ['*', '/'].includes(resultArr[i])) {
      temp[temp.length - 1].push(resultArr[i]);
    } else if (['+', '-'].includes(resultArr[i])) {
      if (temp[temp.length - 1].length === 1) {
        // 1+2*3/2+2*4
        // 1+(2*3/2)+(2*4)
        temp[temp.length - 1] = parseFloat(temp[temp.length - 1][0])
      }
      temp.push([])
      temp[temp.length - 1] = resultArr[i];
      temp.push([])
    }
  }
  if (temp[temp.length - 1].length === 1) {
    // 1+2*3/2+2*4
    // 1+(2*3/2)+(2*4)
    temp[temp.length - 1] = parseFloat(temp[temp.length - 1][0])
  }
  let runObjItem;
  if (['+', '-'].includes(temp[1])) {
    runObjItem = new runObj(temp[1], [temp[0], temp[2]]);
  }
  return runObjItem.run()
}
export default numberCalc;