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
      this.data = data;
    }
    run() {
      if (this.type === '+') {
        const BigNumber = require('bignumber.js');
        return BigNumber.sum(this.data[0], this.data[1]).toNumber()
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
          temp[temp.length - 1] = parseFloat(temp[temp.length - 1][0]);
        }
        temp.push([]);
        temp[temp.length - 1] = resultArr[i];
        temp.push([]);
      }
    }
    if (temp[temp.length - 1].length === 1) {
      // 1+2*3/2+2*4
      // 1+(2*3/2)+(2*4)
      temp[temp.length - 1] = parseFloat(temp[temp.length - 1][0]);
    }
    let runObjItem;
    if (['+', '-'].includes(temp[1])) {
      runObjItem = new runObj(temp[1], [temp[0], temp[2]]);
    }
    return runObjItem.run()
  }

  const testList = [
    // ['1+2*3/2+2*4', ['1', '+', '2','*','3','/','2','+','2','*','4']],
    // ['1+2*3+2*4', ['1', '+', '2','*','3','+','2','*','4']],
    // ['1+2*3+2', ['1', '+', '2','*','3','+','2']],
    // ['1+2*3', ['1', '+', '2','*','3']],
    ['0.1+0.2', ['0.1', '+', '0.2'], 0.3],
    // ['0.1+0.2+0.3', ['0.1', '+', '0.2', '+', '0.3']],
    // ['1+2', ['1', '+', '2']],
    // ['134+2', ['134', '+', '2']],
    // ['(12+22)*2', ['(', '12', '+', '22', ')', '*', '2']],
    // ['3**2', ['3', '**', '2']],
    // ['sin(1)', ['sin', '(', '1', ')']],
    // ['cos(1)', ['cos', '(', '1', ')']],
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
