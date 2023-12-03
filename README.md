# 解决js数字计算精度问题

js 在数字计算的时候，存在"浮点数精度丢失"问题。

比如：0.1+0.2 = 0.30000000000000004

在计算和金额计算等场景下，就会存在健壮问题。本npm包，通过最简单的一个api方式解决这个问题。

# 引入
```
npm i calc-number --save
```
# 使用
```javascript
import calcNumber from 'calc-number'

const result = calcNumber('0.1+0.2')
console.log(result);// 输出0.3
```

# 说明
```javascript
// 支持括号
calcNumber('(0.3+0.3)*3');// 1.8

// 连续运算会正确的计算优先级*/大于+-
calcNumber('1+2*3/2+2*4');// 12

// 支持**幂次方运算
calcNumber('3**2')// 9
```