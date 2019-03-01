# monkey-api

API管理

- 环境部署
- 目录结构

## 环境部署
### 参考文档
[egg docs][egg]

### 开发环境

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### 部署

```
$ npm start
$ npm stop
```

### 单元测试
- egg-bin 内置了 `mocha`, `thunk-mocha`, `power-assert`, `istanbul` 等框架，让你可以专注于写单元测试，无需理会配套工具。
- 断言库非常推荐使用 `power-assert`。
- 具体参见 [egg 文档 - 单元测试](https://eggjs.org/zh-cn/core/unittest)。


### 内置指令
- 使用 `npm run lint` 来做代码风格检查。
- 使用 `npm test` 来执行单元测试。
- 使用 `npm run autod` 来自动检测依赖更新，详细参见 [autod](https://www.npmjs.com/package/autod) 。

## 目录结构
- app/router.js 用于配置URL路由规则
- app/controller/** 用于解析用户的输入，处理后返回相应的结果
- app/service/** 用于编写业务逻辑层【如访问数据库相关的操作】
- app/middleware/** 用于编写中间件，洋葱圈模型，如在路由外增加auth校验
- app/extend/** 用于框架的扩展
- app/public/** 用于放置静态资源
- app/schedule/** 用于放置定时任务
- app/view/** 用于放置模版文件

## egg内置基础对象
包括从koa继承的 Application, Context, Request, Response 以及框架扩展对象 Controller, Service, Helper, Config, Logger等



[egg]: https://eggjs.org