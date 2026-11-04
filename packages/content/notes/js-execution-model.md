---
title: JS 执行模型：编译阶段、执行上下文与调用栈
date: '2026-11-03'
track: frontend
tags: [js, 执行上下文, 面试高频]
level: 3
summary: 从「变量提升」的怪现象，讲清 JS 代码在真正执行前发生了什么。
---

# JS 执行模型：编译阶段、执行上下文与调用栈

## 一句话

JS 不是「一行一行往下跑」的，每段代码执行前先有编译阶段：创建**执行上下文**（变量环境 + 词法环境）、处理 `var`/函数声明的提升，然后才进入执行阶段、压入调用栈。

## 我跑过的代码

```js
console.log(a) // undefined，而不是报错
var a = 1

foo() // 'foo'
function foo() {
  console.log('foo')
}

console.log(b) // ReferenceError（TDZ）
let b = 2
```

## 我原来的错误认知

以为 `let` 和 `var` 的差异只是「能不能重复声明」；实际上 `let` 也有提升，只是被放在「暂时性死区」（TDZ），声明前访问直接抛错。

## 面试官会怎么问

1. 是什么：`var` 和 `let` 提升有什么不同？
2. 为什么：为什么 `typeof b` 在 TDZ 里也会抛 ReferenceError？
3. 如果：`var` 在函数内提升但形参优先，谁赢？

## 项目里怎么用

暂无，TODO：在调试 `skilitlab` 前端作用域问题时验证一次。
