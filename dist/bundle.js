(function () {
  'use strict';

  function split (runStr) {
    // 1+2
    // let allKeyWord = ['**']
    let resultArr = [];
    let split = 0;
    while (split < runStr.length) {
      if (['sin', 'cos'].includes(runStr.slice(split, split + 3))) {
        resultArr.push(runStr.slice(split, split + 3));
        split += 2;
      } else if (['**'].includes(runStr.slice(split, split + 2))) {
        resultArr.push(runStr.slice(split, split + 2));
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
        resultArr.push(numberStr);
      }

      split++;
    }
    return resultArr
  }

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
      const BigNumber = require('bignumber.js');
      if (this.type === '+') {
        const temp = new BigNumber(this.data[0]);
        return temp.plus(this.data[1]).toNumber()
      } else if (this.type === '-') {
        const temp = new BigNumber(this.data[0]);
        return temp.minus(this.data[1]).toNumber()
      } else if (this.type === '*') {
        const temp = new BigNumber(this.data[0]);
        return temp.multipliedBy(this.data[1]).toNumber()
      } else if (this.type === '/') {
        const temp = new BigNumber(this.data[0]);
        return temp.div(this.data[1]).toNumber()
      } else if (this.type === '**') {
        const temp = new BigNumber(this.data[0]);
        return temp.pow(this.data[1]).toNumber()
      } else if (this.type === 'number') {
        return this.data[0];
      } else if (this.type === 'sin') {
        return Math.sin(this.data[0]);
      } else if (this.type === 'cos') {
        return Math.cos(this.data[0]);
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
    ['**'],
    ['*', '/'],
    ['+', '-'],
  ];// 以优先级排列
  function arrayToRunObjType(resultArr, endKeyWord = []) {
    let temp = [[]];
    for (let i = 0; i < resultArr.length; i++) {
      if (endKeyWord.includes(resultArr[i])) {
        break;
      }
      if (resultArr[i].match(/\d+/)) {
        temp[temp.length - 1].push(resultArr[i]);
      } else if (resultArr[i] === '(') {
        const childRunList = [];
        for (let j = i + 1; j < resultArr.length; j++) {
          if (resultArr[j] === ')') {
            break;
          }
          childRunList.push(resultArr[j]);
        }
        const result = arrayToRunObjType(childRunList, [')']);
        temp[temp.length - 1].push(result);
        i += childRunList.length + 1;
      } else if (['sin', 'cos'].includes(resultArr[i])) {
        const nextObj = arrayToRunObjType(resultArr.slice(i + 2), [')']);
        temp[temp.length - 1].push(nextObj);
        temp[temp.length - 1].push(resultArr[i]);
      } else if (['**', '*', '/', '+', '-'].includes(resultArr[i])) {
        if (temp[temp.length - 1].length === 1) {
          temp[temp.length - 1].push(resultArr[i]);
        } else {
          const preview = temp[temp.length - 1];
          const thisIndex = allKeyWord.findIndex(v => v.includes(resultArr[i]));
          const preIndex = allKeyWord.findIndex(v => v.includes(preview[1]));
          const allNextKeyword = [];
          allKeyWord.slice(thisIndex + 1).forEach(v => {
            v.forEach(vv => {
              allNextKeyword.push(vv);
            });
          });
          if (thisIndex < preIndex || (['**'].includes(resultArr[i]) && thisIndex === preIndex)) { // 本优先级更高进行优先级抢夺，**连自己也会抢夺
            const nextObj = arrayToRunObjType(resultArr.slice(i + 1), allNextKeyword);
            preview[preview.length - 1] = [
              preview[preview.length - 1],
              resultArr[i],
              nextObj,
            ];
          } else {
            temp[temp.length - 1] = [temp[temp.length - 1]];
            temp[temp.length - 1].push(resultArr[i]);
          }
        }
      } else {
        throw new Error('分词失败' + resultArr[i])
      }
    }
    if (temp[temp.length - 1].length === 1) {
      // 1+2*3/2+2*4
      // 1+(2*3/2)+(2*4)
      if (typeof temp[temp.length - 1][0] === 'string') {
        temp[temp.length - 1] = parseFloat(temp[temp.length - 1][0]);
      } else {
        temp[temp.length - 1] = temp[temp.length - 1][0];
      }
    }
    if (temp.length === 1) {
      temp = temp[0];
    }
    let runObjItem;
    if (typeof temp === 'number') {
      runObjItem = new runObj('number', [temp]);
    } else if (['+', '-', '*', '/', '**'].includes(temp[1])) {
      runObjItem = new runObj(temp[1], [temp[0], temp[2]]);
    } else if (['sin', 'cos'].includes(temp[1])) {
      runObjItem = new runObj(temp[1], [temp[0]]);
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
    let runObjItem = arrayToRunObjType(resultArr, []);
    return runObjItem.run()
  }

  const testList = [
    ['1+2*3/2+2*4', ['1', '+', '2', '*', '3', '/', '2', '+', '2', '*', '4'], 12],
    ['1+2*3+2*4', ['1', '+', '2', '*', '3', '+', '2', '*', '4'], 15],
    ['1+2*3+2', ['1', '+', '2', '*', '3', '+', '2'], 9],
    ['1+2*3', ['1', '+', '2', '*', '3'], 7],
    ['2*(3+4)', ['2', '*', '(', '3', '+', '4', ')'], 14],
    ['2*3', ['2', '*', '3'], 6],
    ['2-3', ['2', '-', '3'], -1],
    ['2/3', ['2', '/', '3'], 2 / 3],
    ['2/4', ['2', '/', '3'], 0.5],
    ['11*0.175', [], 1.925],
    ['39.9/100', [], 0.399],
    ['69.51 - 15', [], 54.51],
    ['2*3*4', ['2', '*', '3', '*', '4'], 24],
    ['0.1+0.2', ['0.1', '+', '0.2'], 0.3],
    ['0.1+0.2+0.3', ['0.1', '+', '0.2', '+', '0.3'], 0.6],
    ['1+2', ['1', '+', '2'], 3],
    ['134+2', ['134', '+', '2'], 136],
    ['(12+22)*2', ['(', '12', '+', '22', ')', '*', '2'], 68],
    ['(0.3+0.3)*3', ['(', '0.3', '+', '0.3', ')', '*', '3'], 1.8],
    ['1+(12+22)*2', ['1', '+', '(', '12', '+', '22', ')', '*', '2'], 69],
    ['1+(12+22)*2+1', ['1', '+', '(', '12', '+', '22', ')', '*', '2'], 70],
    ['1+(12+22)*2+(1+1)', ['1', '+', '(', '12', '+', '22', ')', '*', '2'], 71],
    ['3**2', ['3', '**', '2'], 9],
    ['2**3**2', ['2', '**', '3', '**', '2'], 512],
    ['8/2/2', [], 2],
    ['2*3**2', ['2', '*', '3', '**', '2'], 18],
    ['2*3**2+1', ['2', '*', '3', '**', '2'], 19],
    ['2*(3**2)', ['2', '*', '3', '**', '2'], 18],
    ['sin(1)', ['sin', '(', '1', ')'], Math.sin(1)],
    ['sin(1+1)', ['sin', '(', '1', '+', '1', ')'], Math.sin(2)],
    ['cos(1)', ['cos', '(', '1', ')'], Math.cos(1)],
  ];

  for (let i = 0; i < testList.length; i++) {
    const result = numberCalc(testList[i][0]);
    if (JSON.stringify(result) !== JSON.stringify(testList[i][2])) {
      console.log(testList[i][0], testList[i][2], result);
      throw new Error('错误')
    } else {
      console.log('success');
    }
  }

})();
