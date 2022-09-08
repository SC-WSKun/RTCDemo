import logo from './logo.svg';
import './App.css';
import React from "react";

function App() {
    //@chunks: 保存recorder保存的数据
    //@chunkList: 保存chunks转换成Blob的数据
    let mediaStreamTrack ;
    let [chunks,handleChunks]= React.useState([])
    let [chunkList,handleChunkList]= React.useState([])
    let [recorder,handleRecorder] = React.useState({})
    let [textLog, handleTextLog] = React.useState('初始化')
    //如果用useRef在改变current后不会重新渲染
    //@storeVideo: 播放视频的vedio标签的ref
    const [storeVideo, setRef] = React.useState();
    React.useEffect(() => {
        handleTextLog('DOMMount')
        // 获取canvas和video节点
        // var canvas = document.getElementById("canvas"),
        //     context = canvas.getContext("2d")
        //todo:后面可以改成ref
        var video = document.getElementById("video"),
            videoObj = {"video": true},
            errBack = function (error) {
                console.log("Video capture error: ", error.code);
            };

        //获取摄像头的流，并赋给video，目前只做了firefox和safari
        if (navigator.getUserMedia) { // Standard
            handleTextLog('Standard')
            navigator.getUserMedia(videoObj, function (stream) {
                video.srcObject = stream;
                video.play();
            }, errBack);
        } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed引擎
            handleTextLog('Webkit')
            navigator.webkitGetUserMedia(videoObj, function (stream) {
                video.srcObject = window.webkitURL.createObjectURL(stream);
                video.play();
            }, errBack);
        } else if (navigator.mozGetUserMedia) { // Firefox-prefixed
            handleTextLog('fireFox')
            navigator.mozGetUserMedia(videoObj, function (stream) {
                //srcObject用于播放音视频流,src用于播放视频,这里stream是流所以必须使用srcObject
                video.srcObject = stream;
                video.play();

                //创建MediaRecorder
                let tempRecorder = new MediaRecorder(stream);
                tempRecorder.ondataavailable = getRecordingData;
                tempRecorder.onstop = saveRecordingData;
                handleRecorder(tempRecorder)
            }, errBack);
        }
        else if (navigator.mediaDevices.getUserMedia) {// safari
            handleTextLog("safari")
            navigator.mediaDevices.getUserMedia(videoObj).then( stream => {
                handleTextLog('success get stream')
                video.srcObject = stream;
                video.play();

                //创建MediaRecorder
                let tempRecorder = new MediaRecorder(stream);
                tempRecorder.ondataavailable = getRecordingData;
                tempRecorder.onstop = saveRecordingData;
                handleRecorder(tempRecorder)
            }).catch(err=>{
                handleTextLog('getMediaFail')
            });
        }
        else {
            handleTextLog("no MediaDevice")
        }
    }, [])

    //录制结束触发
    //@e: 录制的数据
    let getRecordingData = (e) => {
        console.log("保存的数据",typeof(e))
        let tempChunks = chunks;
        tempChunks.push(e.data)
        handleChunks(tempChunks)
    }

    //stop触发时的处理函数
    let saveRecordingData = () => {
        console.log("saving")
        //这里有个坑，safari不支持webm类型的Blob视频，虽然百度搜了下说是支持，但是貌似Blob的webm类型会被拒绝
        let blob = new Blob(chunks, {'type': 'video/mp4'}),
            videoStream = URL.createObjectURL(blob);
        let tempChunksList = chunkList;
        tempChunksList.push({stream: videoStream});
        handleChunkList(tempChunksList)
        handleChunks([]);
    }

    //开始录像
    let startRecording = () => {
        handleTextLog('start')
        recorder.start();
    }

    //结束录像
    let endRecording = () => {
        handleTextLog('stop')
        recorder.stop();
    }

    //播放存储录像
    let playStoreVideo = () => {
        console.log(chunkList)
        let item = chunkList[0];//todo:默认播放第一个，这个后面可以更改为index参数
        handleTextLog(JSON.stringify(item))
        storeVideo.src = item.stream;
        storeVideo.muted = false;
        storeVideo.play();
        setRef(storeVideo)
    }


    return (
        <div className="App">
            <h1>这是一个录制视频的Demo，点击start进行录制，点击stop停止录制，点击playStoreVideo播放视频<br/>目前支持Safari in ios和fireFox in PC</h1>
            <video id={"video"}></video>
            {/*<canvas id={"canvas"}></canvas>*/}
            <p>{textLog}</p>
            <button onClick={startRecording}>start</button>
            <button onClick={endRecording}>stop</button>
            <button onClick={playStoreVideo}>playStoreVideo</button>
            <video id={"storeVideo"} ref={newRef=>setRef(newRef)}></video>
        </div>
    );
}

export default App;
