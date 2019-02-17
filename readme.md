## 简介
项目主要目的是提高一亩三分地使用体验，欢迎大家发PR，丰富并modernize这个repo。

## 声明
所爬内容所有权为一亩三分地所有。

## Demo
http://app.chaofz.me/

## TODOs

### Infrastucture
* Continuous Integration
  * PR发布后，自动跑unit tests。unit tests全过了后才能merge
  * 同时检测coding style和code coverage
* Continuous Deployment
  * 使用squash merge，只留下PR title为commit message
  * PR merge后自动prepend changelog.md
  * PR merge后自动deployment，用travis, jenkins都行

### Dev Tools
* Tools Level
  * Migrate 到 webpack 4
  * 添加 coding style 检测 tool
  * 更新 outdated NPM packages
* Unit Tests
  * 添加 unit test framework
  * 任何新function都要加unit test

### Backend
* Language Level
  * 检测代码是否兼容 Node.js 11
  * 用 TypeScript 重写
* Database
  * 把 Mongo 换成 Postgres
  * 添加 Migration
* App level
  * 添加用户管理功能和personal settings
      * 持久化bookmarks
  * 若加入用户管理，需要转为HTTPS

### Frontend
* Language Level
  * 检测代码是否兼容最新 React
  * 用 TypeScript 或 Jest 重写
* UI Level
  * Responsive
* App Level
  * 添加 redux
  * 去除我copy/paste的代码
  * 重构大部分 componments

### Crawler
* 一亩三分地已经部分改版，需要改下爬虫
* 爬评论 
