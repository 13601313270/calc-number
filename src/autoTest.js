import numberCalc from "./index";
import split from './split'

const testList = [
  ['9e+22 / 9e+20', ['9e+22', '/', '9e+20'], 100],
  ['1+2*3/4+5*6', ['1', '+', '2', '*', '3', '/', '4', '+', '5', '*', '6'], 32.5],
  ['1+2*3+2*4', ['1', '+', '2', '*', '3', '+', '2', '*', '4'], 15],
  ['1+2*3+2', ['1', '+', '2', '*', '3', '+', '2'], 9],
  ['1+2*3', ['1', '+', '2', '*', '3'], 7],
  ['-6.99*100', ['-6.99', '*', '100'], -699],
  ['2*(3+4)', ['2', '*', '(', '3', '+', '4', ')'], 14],
  ['2*3', ['2', '*', '3'], 6],
  ['1+3', ['1', '+', '3'], 4],
  ['2-3', ['2', '-', '3'], -1],
  ['2/3', ['2', '/', '3'], 2 / 3],
  ['2/4', ['2', '/', '4'], 0.5],
  ['11*0.175', ['11', '*', '0.175'], 1.925],
  ['39.9/100', ['39.9', '/', '100'], 0.399],
  ['69.51 - 15', ['69.51', '-', '15'], 54.51],
  ['2*3*4', ['2', '*', '3', '*', '4'], 24],
  ['0.1+0.2', ['0.1', '+', '0.2'], 0.3],
  ['0.1+0.2+0.3', ['0.1', '+', '0.2', '+', '0.3'], 0.6],
  ['1+2', ['1', '+', '2'], 3],
  ['134+2', ['134', '+', '2'], 136],
  ['(12+22)*2', ['(', '12', '+', '22', ')', '*', '2'], 68],
  ['(0.3+0.3)*3', ['(', '0.3', '+', '0.3', ')', '*', '3'], 1.8],
  ['1+(12+22)*2', ['1', '+', '(', '12', '+', '22', ')', '*', '2'], 69],
  ['1+(12+22)+1*2', ['1', '+', '(', '12', '+', '22', ')', '+', '1', '*', '2'], 37],
  ['1+(12+22)*2+1', ['1', '+', '(', '12', '+', '22', ')', '*', '2', '+', '1'], 70],
  ['1+(12+22)*2+(1+1)', ['1', '+', '(', '12', '+', '22', ')', '*', '2', '+', '(', '1', '+', '1', ')'], 71],
  ['(19*0.02+39)', ['(', '19', '*', '0.02', '+', '39', ')'], 39.38],
  ['(19*0.02+39*1+0)', ['(', '19', '*', '0.02', '+', '39', '*', '1', '+', '0', ')'], 39.38],
  ['(19*0.02+39*1)', ['(', '19', '*', '0.02', '+', '39', '*', '1', ')'], 39.38],
  ['(19*0.02+39*0.06)/1000', ['(', '19', '*', '0.02', '+', '39', '*', '0.06', ')', '/', '1000'], 0.00272],
  ['3**2', ['3', '**', '2'], 9],
  ['2**3**2', ['2', '**', '3', '**', '2'], 512],
  ['8/2/2', ['8', '/', '2', '/', '2'], 2],
  ['2*3**2', ['2', '*', '3', '**', '2'], 18],
  ['2*3**2+1', ['2', '*', '3', '**', '2', '+', '1'], 19],
  ['2*(3**2)', ['2', '*', '(', '3', '**', '2', ')'], 18],
  ['sin(1)', ['sin', '(', '1', ')'], Math.sin(1)],
  ['sin(1+1)', ['sin', '(', '1', '+', '1', ')'], Math.sin(2)],
  ['cos(1)', ['cos', '(', '1', ')'], Math.cos(1)],
  ['cos(1)+1', ['cos', '(', '1', ')', '+', '1'], Math.cos(1) + 1],
  ['cos(1)+sin(1)', ['cos', '(', '1', ')', '+', 'sin', '(', '1', ')'], Math.cos(1) + Math.sin(1)],
  ['tan(1)', ['tan', '(', '1', ')'], Math.tan(1)],
  ['atan(1)', ['atan', '(', '1', ')'], Math.atan(1)],
  ['37.3*100', ['37.3', '*', '100'], 3730],
  ['6%5', ['6', '%', '5'], 1],
  ['1+6%5', ['1', '+', '6', '%', '5'], 2],
  ['6-6%5', ['6', '-', '6', '%', '5'], 5],
  ['6**6%5', ['6', '**', '6', '%', '5'], 1],
  ['12.333+3.44', ['12.333', '+', '3.44'], 15.773],
  ['(12.333+3.44) + 1', ['(', '12.333', '+', '3.44', ')', '+', '1'], 16.773],
  ['(12.333+3.44)', ['(', '12.333', '+', '3.44', ')'], 15.773],
  ['(12.333+3.44).toFixed(2)', ['(', '12.333', '+', '3.44', ')', '.', 'toFixed', '(', '2', ')'], 15.77],
  ['(12.333*3.44).toFixed(1+2)', ['(', '12.333', '*', '3.44', ')', '.', 'toFixed', '(', '1', '+', '2', ')'], 42.426],
  ['1+(12.333+3.44).toFixed(2)', ['1', '+', '(', '12.333', '+', '3.44', ')', '.', 'toFixed', '(', '2', ')'], 16.77],
  ['2+(12.333+3.44).toFixed(2)', ['2', '+', '(', '12.333', '+', '3.44', ')', '.', 'toFixed', '(', '2', ')'], 17.77],
  ['(12.333*3.44).toFixed(2)+3', ['(', '12.333', '*', '3.44', ')', '.', 'toFixed', '(', '2', ')', '+', '3'], 45.43],
  ['(42).toFixed(2)+3', ['(', '42', ')', '.', 'toFixed', '(', '2', ')', '+', '3'], 45],
  ['2+(12.333+3.44).toFixed(2)+3', ['2', '+', '(', '12.333', '+', '3.44', ')', '.', 'toFixed', '(', '2', ')', '+', '3'], 20.77],
  ['2+(12.333+3.44).toFixed(2)+3+1', ['2', '+', '(', '12.333', '+', '3.44', ')', '.', 'toFixed', '(', '2', ')', '+', '3', '+', '1'], 21.77],
  ['(42).toFixed(2)+(42).toFixed(2)', ['(', '42', ')', '.', 'toFixed', '(', '2', ')', '+', '(', '42', ')', '.', 'toFixed', '(', '2', ')'], 84],
  ['(42).toFixed(2)+3*2', ['(', '42', ')', '.', 'toFixed', '(', '2', ')', '+', '3', '*', '2'], 48],
  ['2**2 + (42).toFixed(2)+3*2', ['2', '**', '2', '+', '(', '42', ')', '.', 'toFixed', '(', '2', ')', '+', '3', '*', '2'], 52],
  ['8.000000000000001e-7', ['8.000000000000001e-7'], 8.000000000000001e-7],
  ['8e-10 * 1000000', ['8e-10', '*', '1000000'], 0.0008],
  ['397 * 8.000000000000001e-7 + 801 * 0.000002 + 0.0007188', ['397', '*', '8.000000000000001e-7', '+', '801', '*', '0.000002', '+', '0.0007188'], 0.0026384],
]

const tempJoinWord = '|||||';
for (let i = 0; i < testList.length; i++) {
  const splitWord = split(testList[i][0]);
  if (splitWord.join(tempJoinWord) !== testList[i][1].join(tempJoinWord)) {
    console.log(testList[i][0])
    console.log(splitWord.join('      '))
    console.log(testList[i][1].join('      '))
    throw new Error('分词错误')
  }

  const result = numberCalc(testList[i][0]);
  if (JSON.stringify(result) !== JSON.stringify(testList[i][2])) {
    console.log(testList[i][0], testList[i][2], result)
    throw new Error('错误')
  } else {
    console.log('success')
  }
}
