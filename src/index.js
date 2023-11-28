import split from "./split";
class runObj {
  constructor(type, data) {
    this.type = type;
    this.data = data.map(v => {
      if (v instanceof runObj) {
        return v.run();
      } else if (v instanceof Array) {
        let runObjItem = new runObj(v[1], [v[0], v[2]]);
        return runObjItem.run();
      } else {
        return v;
      }
    });
  }
  run() {
    const BigNumber = require('bignumber.js')
    if (this.type === '+') {
      return BigNumber.sum(this.data[0], this.data[1]).toNumber()
    } else if (this.type === '-') {
      const temp = new BigNumber(this.data[0])
      return temp.minus(this.data[1]).toNumber()
    } else if (this.type === '*') {
      const temp = new BigNumber(this.data[0])
      return temp.multipliedBy(this.data[1]).toNumber()
    } else if (this.type === '/') {
      const temp = new BigNumber(this.data[0])
      return temp.div(this.data[1]).toNumber()
    } else {
      throw new Error('运算类型不存在' + this.type)
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

function arrayToRunObjType(resultArr) {
  let temp = [[]];
  // 1 + 1 * 2 - 3 * 2
  // [1 ,+ ,1, * ,2, - ,3, * ,2]
  // [[1] , [+] ,[1, * ,2], [-] ,[3, * ,2]]
  for (let i = 0; i < resultArr.length; i++) {
    if (resultArr[i].match(/\d+/)) {
      temp[temp.length - 1].push(resultArr[i]);
    } else if (resultArr[i] === '(') {
      const chileRunList = [];

      for (let j = i + 1; j < resultArr.length; j++) {
        if (resultArr[j] === ')') {
          break;
        }
        chileRunList.push(resultArr[j])
      }
      const result = arrayToRunObjType(chileRunList);
      console.log('===================')
      console.log(chileRunList);
      temp[temp.length - 1].push(result);
      i += chileRunList.length + 1;
    }
    else if (['*', '/'].includes(resultArr[i])) {
      if (temp[temp.length - 1].length === 1) {
        temp[temp.length - 1].push(resultArr[i]);
      } else {
        temp[temp.length - 1] = [temp[temp.length - 1]]
        temp[temp.length - 1].push(resultArr[i]);
      }
    } else if (['+', '-'].includes(resultArr[i])) {
      if (temp[temp.length - 1].length === 1) {
        temp[temp.length - 1] = parseFloat(temp[temp.length - 1][0])
      }
      temp.push([])
      if (temp.length > 2) {
        temp = [[temp[0], temp[1], temp[2]], []]
      }
      temp[temp.length - 1] = resultArr[i];
      temp.push([])
    } else {
      throw new Error('分词失败' + resultArr[i])
    }
  }
  if (temp[temp.length - 1].length === 1) {
    // 1+2*3/2+2*4
    // 1+(2*3/2)+(2*4)
    temp[temp.length - 1] = parseFloat(temp[temp.length - 1][0])
  }
  if (temp.length === 1) {
    temp = temp[0]
  }
  console.log('=============temp=============')
  console.log(temp)
  let runObjItem;
  if (['+', '-', '*', '/'].includes(temp[1])) {
    runObjItem = new runObj(temp[1], [temp[0], temp[2]]);
  } else {
    throw new Error('结构不存在' + temp[1])
  }
  return runObjItem;
}

function numberCalc(runStr) {
  // 第一步分词
  let resultArr = split(runStr);// '1+2'    =>   ['1', '+', '2']
  // 第二步
  // ['1', '+', '2'] => { runType: '+', data: [{runType: 'number', data: 1},'2']}
  let runObjItem = arrayToRunObjType(resultArr)
  return runObjItem.run()
}
export default numberCalc;