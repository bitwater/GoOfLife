# Go of life (生命围棋)  Web
这是我和Jake在集智俱乐部发起的开源项目，力图将John Conway的生命游戏与中国的古老游戏：围棋相结合，开发出一套新的游戏：生命围棋（Go of Life）。

[详见Wiki](http://wiki.swarma.net/index.php/%E7%94%9F%E5%91%BD%E6%B8%B8%E6%88%8F%E5%9B%B4%E6%A3%8B)

[测试地址](http://123.57.154.231:3000/)

Web端主要作为快速迭代和可传播的游戏原型，重点在于打磨核心规则，时机成熟后再开发Android和iOS App。

## 技术选型
云服务：阿里云

Web：Node.js + Express4 + Html5 Canvas

实时通信：Socket.io （考虑是否迁移使用LeanCloud的实时通信SDK）

项目构建：Grunt

模块化： require.js

## 本地运行

首先确认本机已经安装 [Node.js](http://nodejs.org/) 和[Grunt](http://www.gruntjs.net/)然后执行下列指令：

安装依赖：

```
npm install
```

开发环境构建，在client/server两端共享core/目录下的核心代码，启动应用：

``` bash
  $ grunt development
  ...
  $ node app
  Conway started: 3000 (development)
```

生产环境构建，合并压缩Javascript/CSS，启动应用：

``` bash
  $ grunt production
  ...
  $ NODE_ENV=production node app
  Conway started: 3000 (production)
```

## 技术挑战
1. 手机屏幕限制，Canvas将迅速成为性能瓶颈，出现延迟卡顿，导致无法随意流畅地伸缩两个时间和空间尺度；
2. 生命游戏和围棋数据存储机制；
3. 目前服务器并发和同步控制还很初级；


## 注意
* 在core/目录下修改代码，并使用grunt进行构建，以防代码不同步

## 相关资料和文档
* [Node.js](https://nodejs.org/en/)
* [Grunt](http://www.gruntjs.net/)
* [Game of Life Wiki](http://www.conwaylife.com/wiki/Conway%27s_Game_of_Life)
* [开源项目Conway](https://github.com/drewblaisdell/conway)
