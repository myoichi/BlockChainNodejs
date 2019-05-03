/*
  BlockChainNodejs v0.01 Preview
  教育目的に限り、無料かつ自由にご利用ください。
  Only Free for Educational purpose

  中本智さんと、彼の本名である金子勇さんに感謝します。
  Thank to Satoshi Nakamoto and his canonical name Isamu Kaneko.

  経緯：
  Motivations:
    私は、シンプルなUNIX OSソースコードが併記された'lions commentary on unix'でUNIXを学びました。
    I had learned UNIX by 'lions commentary on unix' that with simple unix os source code.
    このソースコードがブロックチェーン技術を学ぶ人々にとっての'lions commentary on unix'になることを望みます。
    I'd like to make this source code be a 'lions commentary on unix' for learning BlockChain.
    このソフトウェアは、教育目的のために、無料でかつなるべく簡単な実装でブロックチェーンを実感してもらうために作成しました。
    This BlockChain Software made for educational use. And for free, get feel so simple implementation.

  ライセンス：
  License:
    このソフトウェアは、教育目的の場合に限り、すべて無料で自由にご利用ください。
    This BlockChain Software only use free for educational use.

    教育目的の場合に限り、次のことを許諾します。
    I only accept to following lines for educational use.
    1) このソフトウェアの無償での配布および利用
    1) Free distribution and use.
    2) このソフトウェアの改変
    2) Modification this Software.

    いかなる場合であっても、次のことを禁止します。
    I do not accept to following lines.
    1) このソフトウェアの有償での配布
    1) Feeable distribution
    2) このソフトウェアの著作権表示の削除
    2) Delete copyright on this source code

  著作権：
  Copyright:
    水口よういち
    Mizuguchi Yoichi
    Hachioji, Tokyo, Japan
    (c)2019 Mizuguchi Yoichi

  機能：
  Functions:
    ・１対１のソケット通信を行う
    ・Communicate with a peer by unix sockets

    ・通信はすべてJson形式とする
    ・All communicate with JSON formatted text

  使用方法：
  How to use:
    1) nodeJSをコンピュータにインストールする
    Prepare to install nodeJS

    2) コマンドラインでブロックチェーン・ノードを２つ起動する
    Boot Two BlockChain Nodes in Command line
    $ node node.js {own host name} {own port} {peer host name} {peer port} 

    起動例
    Boot Example (Communicate A and B) 
    (Window A)
    $ node node.js localhost 3001 localhost 3000
    (Window B)
    $ node node.js localhost 3000 localhost 3001

    3) コンソールから何か文字を入力すると、送金トランザクション（データのブロックチェーンへの保存）を行う
    Make send a transaction (or save a data on BlockChain) with input on console.

  用語：
  Words:
    コンソールログなどで使用
    Use console logs

    1) RequestNode
     = Client
      要求を発信するノード
      BlockChain Node that call requests

    2) ListenNode
     = Server
      要求を受信するノード
      BlockChain Node that receive requests

  確認環境：
  Verified environment:
    Mac OS Mojave 10.14.4
    node v9.11.1
    npm 5.6.0 (have not depend on other npm modules.)
    標準npmモジュールのみ使用しています。
    Only use standard npm modules.

 */
'use strict';
const net = require('net'); // CommonJS
const fs = require('fs');
const util = require('util')
const chain = require('./module');  // import default classes

// コマンドライン指定
let ownOptions = {};
ownOptions.host = process.argv[2];  // 自ノード情報  ex. localhost
ownOptions.port = process.argv[3];  // ex. 3000
let peerOptions = {};
peerOptions.host = process.argv[4]; // peer情報 ex. localhost
peerOptions.port = process.argv[5]; // ex. 3001

/*
  初期設定
 */
// オリジンブロックをjsonファイルとしてストアに保存する
let block = new chain.Block(chain.Block.originBlock);
console.log(block);
let blockChain = chain.BlockChain;
console.log(blockChain);
blockChain.writeFile();

/*
  サーバ（受信まち）
 */
let listenNodeStatus = new chain.ListenNodeStatus();
const server = net.createServer(function(conn) {
  // server.maxConnections = 3;
  console.log('Server: ソケット通信を開始 Booted socket communication.');

  conn.on('data', function(data) {
    console.log('Server: read ListenedPeer(' + conn.remoteAddress + ' ' + conn.remotePort + ')からデータ受信 received data：' + data);
    // json解析
    data = JSON.parse(data);
    console.log('Server: listenNodeStatus.status:' + listenNodeStatus.status);

    if (listenNodeStatus.meetConditions(data)) {
      listenNodeStatus.write(conn, true);
      listenNodeStatus.updateStatus();
    } else {
      listenNodeStatus.write(conn, false);
    }
  });
  conn.on('close', function(){
    listenNodeStatus.updateStatus(chain.ListenNodeStatus.NodeStatus.PeerClosed);
    console.log('Server: ListenedPeerが通信クローズした Closed ListenedPeer connection.');
  });
}).listen(ownOptions.port);

console.log('Server: listening on port ' + ownOptions.port);


/* 
  クライアント（発信）
 */
let requestNodeStatus = new chain.RequestNodeStatus();
const client = new net.Socket();
function connectToPeer() {
  console.log('Client: connectToPeer');
  client.setEncoding('utf8');
  client.connect(peerOptions);
}

connectToPeer();

client.on('connect', function() {
  console.log('Client: requestNodeStatus.status:' + requestNodeStatus.status);
  console.log('Client: RequestedPeerと通信開始した Booted communication with RequestedPeer');
  // 自分のバージョンを通知
  requestNodeStatus.updateStatus();
  requestNodeStatus.write(client);
  requestNodeStatus.updateStatus();
});

client.on('error', function() {
  console.log('Client: error occure.');
  setTimeout(function() {
    connectToPeer();
  }, 1000);
});

client.on('data', function(data) {
  console.log('Client: read RequestedPeer(' + client.remoteAddress + ' ' + client.remotePort + ')からデータ受信 received data：' + data);
  // json解析
  data = JSON.parse(data);
  console.log('Client: requestNodeStatus.status:' + requestNodeStatus.status);

  if (requestNodeStatus.meetConditions(data)) {
    requestNodeStatus.write(client);
    requestNodeStatus.updateStatus();
  }
});

client.on('close', function() {
  console.log('Client: RequestedPeerが通信クローズした Closed RequestedPeer communication.');
  listenNodeStatus.updateStatus(chain.RequestNodeStatus.NodeStatus.Close);
});


/*
  コンソール
  clientとして送信する
 */
process.stdin.resume();

process.stdin.on('data', function(data) {
  console.log('コンソールから入力あり Input from console.：' + data);
  if (requestNodeStatus.meetConditions(data)) {
    requestNodeStatus.writeReqTransfer(client);
    requestNodeStatus.updateStatus(chain.RequestNodeStatus.NodeStatus.RequestedTransfer);
  }
});
