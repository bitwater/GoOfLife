# Go of life (生命围棋)  Web
双人对弈生命游戏围棋，让围棋活起来。

这是我和张江在集智俱乐部，发起的生命围棋开源项目，详见[Wiki](http://wiki.swarma.net/index.php/%E7%94%9F%E5%91%BD%E6%B8%B8%E6%88%8F%E5%9B%B4%E6%A3%8B)

Web端主要作为快速迭代和可传播的游戏原型，后续计划开发Android和iOS App。

目前以开源项目[Conway](https://github.com/drewblaisdell/conway)为基础。

## 技术选型
云服务：LeanCloud

Web：Node.js + Express4 + Html5 + Canvas

实时通信：Socket.io （考虑是否迁移使用LeanCloud的实时通信SDK）

项目构建：Grunt

## 本地运行

首先确认本机已经安装 [Node.js](http://nodejs.org/) 运行环境和 [LeanCloud 命令行工具](https://leancloud.cn/docs/cloud_code_commandline.html)，然后执行下列指令：

安装依赖：

```
npm install
```

开发环境构建，在client/server两端共享core/目录下的核心代码，启动应用

``` bash
  $ grunt development
  ...
  $ node app
  Conway started: 3000 (development)
```

生产环境构建，合并压缩Javascript/CSS，启动应用

``` bash
  $ grunt production
  ...
  $ NODE_ENV=production node app
  Conway started: 3000 (production)
```

补充：LeanCloud启动项目

```
avoscloud
```

应用即可启动运行：[localhost:3000](http://localhost:3000)

部署到 LeanEngine

部署到测试环境：
```
avoscloud deploy
```

部署到生产环境：
```
avoscloud publish
```

## 大问题
1. Canvas可能将迅速成为性能瓶颈；
2. 目前并发和同步控制还较为初级；

##注意
* core/目录下修改代码，以防代码不同步

## 相关项目和文档
* [开源项目Conway](https://github.com/drewblaisdell/conway)
* [Node.js](https://nodejs.org/en/)
* [Game of Life](http://www.conwaylife.com/wiki/Conway%27s_Game_of_Life)
* [LeanEngine 指南](https://leancloud.cn/docs/cloud_code_guide.html)
* [JavaScript 指南](https://leancloud.cn/docs/js_guide.html)
* [JavaScript SDK API](https://leancloud.cn/docs/api/javascript/index.html)
* [命令行工具详解](https://leancloud.cn/docs/cloud_code_commandline.html)
* [LeanEngine FAQ](https://leancloud.cn/docs/cloud_code_faq.html)
