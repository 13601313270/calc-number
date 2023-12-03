import split from "./split";
import allMethod from './method/index'

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
      const temp = new BigNumber(this.data[0])
      return temp.plus(this.data[1]).toNumber()
    } else if (this.type === '-') {
      const temp = new BigNumber(this.data[0])
      return temp.minus(this.data[1]).toNumber()
    } else if (this.type === '*') {
      const temp = new BigNumber(this.data[0])
      return temp.multipliedBy(this.data[1]).toNumber()
    } else if (this.type === '/') {
      const temp = new BigNumber(this.data[0])
      return temp.div(this.data[1]).toNumber()
    } else if (this.type === '**') {
      const temp = new BigNumber(this.data[0])
      return temp.pow(this.data[1]).toNumber()
    } else if (this.type === 'number') {
      return this.data[0];
    } else if (allMethod[this.type]) {
      return allMethod[this.type](this.data);
    } else {
      console.log(this.type);
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

const allKeyWord = [
  Object.keys(allMethod),
  ['**'],
  ['*', '/'],
  ['+', '-'],
];// 以优先级排列
let slip = 0
function arrayToRunObjType(resultArr, endKeyWord = []) {
  let temp = [[]];
  for (; slip < resultArr.length; slip++) {
    const word = resultArr[slip]
    if (endKeyWord.includes(word)) {
      break;
    }
    if (word.match(/\d+/)) {
      temp[temp.length - 1].push(word);
    } else if (word === '(') {
      slip++;
      const result = arrayToRunObjType(resultArr, [')']);
      if (resultArr[slip] !== ')') {
        throw new Error('结构错误')
      }
      temp[temp.length - 1].push(result);
    } else if (Object.keys(allMethod).includes(word)) {
      slip += 2;
      const nextObj = arrayToRunObjType(resultArr, [')'])
      if (temp[temp.length - 1].length === 0) {
        temp[temp.length - 1].push(nextObj)
        temp[temp.length - 1].push(word)
      } else {
        temp[temp.length - 1].push([nextObj, word])
      }
      if (resultArr[slip] !== ')') {
        throw new Error('结构错误')
      }
    } else if (['**', '*', '/', '+', '-'].includes(word)) {
      if (temp[temp.length - 1].length === 1) {
        temp[temp.length - 1].push(word);
      } else {
        const preview = temp[temp.length - 1];
        const thisIndex = allKeyWord.findIndex(v => v.includes(word));
        const preIndex = allKeyWord.findIndex(v => v.includes(preview[1]))
        const allNextKeyword = []
        allKeyWord.slice(thisIndex + 1).forEach(v => {
          v.forEach(vv => {
            allNextKeyword.push(vv)
          })
        })
        if (thisIndex < preIndex || (['**'].includes(word) && thisIndex === preIndex)) { // 本优先级更高进行优先级抢夺，**连自己也会抢夺
          slip++;
          const nextObj = arrayToRunObjType(resultArr, allNextKeyword)
          slip--;
          preview[preview.length - 1] = [
            preview[preview.length - 1],
            word,
            nextObj,
          ]
        } else {
          temp[temp.length - 1] = [temp[temp.length - 1]]
          temp[temp.length - 1].push(word);
        }
      }
    } else {
      throw new Error('分词失败' + word)
    }
  }
  if (temp[temp.length - 1].length === 1) {
    // 1+2*3/2+2*4
    // 1+(2*3/2)+(2*4)
    if (typeof temp[temp.length - 1][0] === 'string') {
      temp[temp.length - 1] = parseFloat(temp[temp.length - 1][0])
    } else {
      temp[temp.length - 1] = temp[temp.length - 1][0]
    }
  }
  // console.log('=================temp==============')
  // console.log(JSON.stringify(temp))
  if (temp.length === 1) {
    temp = temp[0]
  }
  if (typeof temp !== 'number') {
    // console.log('=================')
    // console.log(temp)
  }

  let runObjItem;
  if (typeof temp === 'number') {
    runObjItem = new runObj('number', [temp]);
  } else if (['+', '-', '*', '/', '**'].includes(temp[1])) {
    runObjItem = new runObj(temp[1], [temp[0], temp[2]]);
  } else if (Object.keys(allMethod).includes(temp[1])) {
    // console.log('=================')
    // console.log(temp)
    runObjItem = new runObj(temp[1], [temp[0]]);
  } else {
    console.log(temp)
    throw new Error('结构不存在' + temp[1])
  }
  return runObjItem;
}

function numberCalc(runStr) {
  // 第一步分词
  let resultArr = split(runStr);// '1+2'    =>   ['1', '+', '2']
  // console.log(resultArr)
  // 第二步
  // ['1', '+', '2'] => { runType: '+', data: [{runType: 'number', data: 1},'2']}
  slip = 0;
  let runObjItem = arrayToRunObjType(resultArr, [])
  // console.log(runObjItem)
  return runObjItem.run()
}
export default numberCalc;