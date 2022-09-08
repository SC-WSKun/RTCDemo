# 项目介绍

这是一个关于WebRTC的Demo，实现了获取摄像头的视频流，并且能够录制视频并保存下来，实现播放。

最终目的是实现获取监控视频流，并实现录制并上传到服务器。

# 技术栈

- React

# 兼容性

目前测试成功的平台有

- fireFox in PC
- safari in IOS

# 代码仓库

https://github.com/SC-WSKun/RTCDemo

# 代码解读

这个项目的核心在于两个API：`getUserMedia`和`MediaRecorder`

- `navigator.getUserMedia`（旧）或`MediaDevices.getUserMedia`（新）：

  **MediaDevices.getUserMedia()** 会提示用户给予使用媒体输入的许可，媒体输入会产生一个[`MediaStream`](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStream)，里面包含了请求的媒体类型的轨道。此流可以包含一个视频轨道（来自硬件或者虚拟视频源，比如相机、视频采集设备和屏幕共享服务等等）、一个音频轨道（同样来自硬件或虚拟音频源，比如麦克风、A/D 转换器等等），也可能是其它轨道类型。

  它返回一个 [`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 对象，成功后会`resolve`回调一个 [`MediaStream`](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStream) 对象。若用户拒绝了使用权限，或者需要的媒体源不可用，`promise`会`reject`回调一个 `PermissionDeniedError` 或者 `NotFoundError` 。

  参考链接：https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia

- `MediaRecorder`

  **MediaRecorder** 是 [MediaStream Recording API](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStream_Recording_API) 提供的用来进行媒体轻松录制的接口，使用`start()`和`stop()`控制录制开始和结束。搭配`start`、`stop`和`ondataavailable`的监听事件可以实现获取录制视频并进行处理的功能。

  参考链接：https://developer.mozilla.org/zh-CN/docs/Web/API/MediaRecorder

总体的流程是：

1. 使用`getUserMedia`获取摄像头视频流
2. 初始化`MediaRecorder`绑定摄像头视频流
3. 在`MediaRecorder`的`ondataavailable`事件回调中获取录制视频数据（对象中的data属性即为Blob视频）并保存
4. 使用`URL.createObjectURL`将生成对应`Blob`的`DOMString`绑定在`video`上播放

然后是关于一些需要注意的小问题：

- `video`标签的`src`属性绑定音视频，`srcObject`属性绑定音视频流，貌似使用`createObjectURL`转换后也可以直接绑定在`src`上。

  ![](https://cdn.jsdelivr.net/gh/SC-WSKun/HexoStaticFile/img/20220909002542.png)

- `navigator.getUserMedia`已经被废弃了（比如safari就不能用），部分浏览器为了兼容还有支持（比如fireFox），开发的时候应该尽量使用`navigation.MediaDevices.getUserMedia`，虽然最终Demo应该用不上这个API

- safari貌似不支持video标签播放webm类型的Blob视频，换成mp4类型就可以播放了

最后是关于能否实现监控视频流的播放：

> `getUserMedia`返回的是`MediaStream`类型的流，而且`MediaRecorder`的参数也需要是`MediaStream`，所以剩下的难点是能否将rtmp等流媒体转换成`MediaStream`，也就是能不能转换成Blob类型，等拿到视频流后再进行测试
>
> 如果使用mjpg的话，目前找到的一种方式是：保存成图片然后用opencv写程序再存成视频，不过用的是cpp
>
> 参考链接：https://blog.csdn.net/qq_33383940/article/details/79893324

# 参考资料汇总

1. [Web mdn](https://developer.mozilla.org/en-US/)
2. [WebRTC本地媒体——媒体模型](https://blog.csdn.net/ice_ly000/article/details/100536016)
3. [改装videoplayer插件，实现html播放RTMP视频](https://www.cnblogs.com/wobuchifanqie/p/10983840.html)
4. [将本地 mjpg 视频流式传输到 html 画布](https://www.it1352.com/2695768.html)
5. [五分钟拆解流媒体入门项目 MJPG-Streamer](https://zhuanlan.zhihu.com/p/499131456)

