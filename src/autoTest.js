import numberCalc from "./index";

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
  ['1+(12+22)+1*2', ['1', '+', '(', '12', '+', '22', ')', '*', '2'], 37],
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
  ['atan(1)', ['atan', '(', '1', ')'], Math.atan(1)],
  ['37.3*100', ['37.3', '*', '100'], 3730],
  ['6%5', ['6', '%', '5'], 1],
  ['1+6%5', ['1', '+', '6', '%', '5'], 2],
  ['6-6%5', ['6', '-', '6', '%', '5'], 5],
  ['6**6%5', ['6', '**', '6', '%', '5'], 1],
]

for (let i = 0; i < testList.length; i++) {
  const result = numberCalc(testList[i][0]);
  if (JSON.stringify(result) !== JSON.stringify(testList[i][2])) {
    console.log(testList[i][0], testList[i][2], result)
    throw new Error('错误')
  } else {
    console.log('success')
  }
}
