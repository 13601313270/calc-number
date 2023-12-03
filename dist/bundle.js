(function () {
  'use strict';

  function sin (data) {
    return Math.sin(data[0]);
  }

  function cos (data) {
    return Math.cos(data[0]);
  }

  function tan (data) {
    return Math.tan(data[0]);
  }

  function atan (data) {
    return Math.atan(data[0]);
  }

  var allMethod = {
    sin,
    cos,
    tan,
    atan,
  };

  function split (runStr) {
    let resultArr = [];
    let split = 0;
    while (split < runStr.length) {
      if (Object.keys(allMethod).includes(runStr.slice(split, split + 3))) {
        resultArr.push(runStr.slice(split, split + 3));
        split += 3;
      } else if (['**'].includes(runStr.slice(split, split + 2))) {
        resultArr.push(runStr.slice(split, split + 2));
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
        resultArr.push(numberStr);
        split++;
      } else {
        split++;
      }
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
    ['sin', 'cos'],
    ['**'],
    ['*', '/'],
    ['+', '-'],
  ];// 以优先级排列
  let slip = 0;
  function arrayToRunObjType(resultArr, endKeyWord = []) {
    let temp = [[]];
    for (; slip < resultArr.length; slip++) {
      const word = resultArr[slip];
      if (endKeyWord.includes(word)) {
        break;
      }
      if (word.match(/\d+/)) {
        temp[temp.length - 1].push(word);
      } else if (word === '(') {
        slip++;
        const result = arrayToRunObjType(resultArr, [')']);
        slip--;
        slip++;// 针对)
        temp[temp.length - 1].push(result);
      } else if (Object.keys(allMethod).includes(word)) {
        if (temp[temp.length - 1].length === 0) {
          // console.log(resultArr.slice(slip + 2))
          slip += 2;
          const nextObj = arrayToRunObjType(resultArr, [')']);
          // console.log(nextObj)
          temp[temp.length - 1].push(nextObj);
          temp[temp.length - 1].push(word);
        } else {
          slip += 2;
          temp[temp.length - 1].push([
            arrayToRunObjType(resultArr, [')']),
            word,
          ]);
        }
      } else if (['**', '*', '/', '+', '-'].includes(word)) {
        if (temp[temp.length - 1].length === 1) {
          temp[temp.length - 1].push(word);
        } else {
          // console.log('???????????????????????')
          const preview = temp[temp.length - 1];
          const thisIndex = allKeyWord.findIndex(v => v.includes(word));
          const preIndex = allKeyWord.findIndex(v => v.includes(preview[1]));
          // console.log(preview[1], word)
          const allNextKeyword = [];
          // console.log(preview)
          allKeyWord.slice(thisIndex + 1).forEach(v => {
            v.forEach(vv => {
              allNextKeyword.push(vv);
            });
          });
          if (thisIndex < preIndex || (['**'].includes(word) && thisIndex === preIndex)) { // 本优先级更高进行优先级抢夺，**连自己也会抢夺
            slip++;
            const nextObj = arrayToRunObjType(resultArr, allNextKeyword);
            slip--;
            preview[preview.length - 1] = [
              preview[preview.length - 1],
              word,
              nextObj,
            ];
          } else {
            temp[temp.length - 1] = [temp[temp.length - 1]];
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
        temp[temp.length - 1] = parseFloat(temp[temp.length - 1][0]);
      } else {
        temp[temp.length - 1] = temp[temp.length - 1][0];
      }
    }
    // console.log('=================temp==============')
    // console.log(JSON.stringify(temp))
    if (temp.length === 1) {
      temp = temp[0];
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
      console.log(temp);
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
    let runObjItem = arrayToRunObjType(resultArr, []);
    // console.log(runObjItem)
    return runObjItem.run()
  }

  const testList = [
    ['1+2*3/4+5*6', ['1', '+', '2', '*', '3', '/', '4', '+', '5', '*', '6'], 32.5],
    ['1+2*3+2*4', ['1', '+', '2', '*', '3', '+', '2', '*', '4'], 15],
    ['1+2*3+2', ['1', '+', '2', '*', '3', '+', '2'], 9],
    ['1+2*3', ['1', '+', '2', '*', '3'], 7],
    ['2*(3+4)', ['2', '*', '(', '3', '+', '4', ')'], 14],
    ['2*3', ['2', '*', '3'], 6],
    ['1+3', ['1', '+', '3'], 4],
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
    ['cos(1)+1', ['cos', '(', '1', ')'], Math.cos(1) + 1],
    ['cos(1)+sin(1)', ['cos', '(', '1', ')', '+' + 'sin' + '(' + '1' + ')'], Math.cos(1) + Math.sin(1)],
    ['tan(1)', ['tan', '(', '1', ')'], Math.tan(1)],
    // ['atan(1)', ['atan', '(', '1', ')'], Math.atan(1)],
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
