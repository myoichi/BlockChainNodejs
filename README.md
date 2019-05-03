#  BlockChainNodejs v0.01 Preview  
  教育目的に限り、無料かつ自由にご利用ください。  
  Only Free for Educational purpose  

  中本智さんと、彼の本名である金子勇さんに感謝します。  
  Thank to Satoshi Nakamoto and his canonical name Isamu Kaneko.  

## 経緯：
## Motivations:
    私は、シンプルなUNIXのOSソースコードが併記された'lions commentary on unix'でUNIXを学びました。  
    I had learned UNIX by 'lions commentary on unix' that with simple unix os source code.  

    このソースコードがブロックチェーン技術を学ぶ人々にとっての'lions commentary on unix'になることを望みます。  
    I'd like to make this source code be a 'lions commentary on unix' for learning BlockChain.  

    このソフトウェアは、教育目的のために、無料でかつなるべく簡単な実装でブロックチェーンを実感してもらうために作成しました。  
    This BlockChain Software made for educational use. And for free, get feel so simple implementation.  

##  ライセンス：
##  License:
    このソフトウェアは、教育目的の場合に限り、すべて無料で自由にご利用ください。  
    This BlockChain Software only use free for educational use.  

    教育目的の場合に限り、次のことを許諾します。  
    I only accept to following lines for educational use.  
1.    このソフトウェアの無償での配布および利用  
     Free distribution and use.
1.    このソフトウェアの改変  
     Modification this Software.

    いかなる場合であっても、次のことを禁止します。  
    I do not accept to following lines.  
1.    このソフトウェアの有償での配布  
     Feeable distribution  
1.    このソフトウェアの著作権表示の削除  
     Delete copyright on this source code  

##  版権：
##  Copyright:
    水口よういち  
    Mizuguchi Yoichi  
    Hachioji, Tokyo, Japan  
    (c)2019 Mizuguchi Youichi  

##  機能：
##  Functions:
-    １対１のソケット通信を行う  
    Communicate with a peer by unix sockets

-    通信はすべてJson形式とする  
    All communicate with JSON formatted text

##  使用方法：
##  How to use:
1.    nodeJSをコンピュータにインストールする  
    Prepare to install nodeJS  

1.    コマンドラインでブロックチェーン・ノードを２つ起動する  
    Boot Two BlockChain Nodes in Command line  

```js
    $ node node.js {own host name} {own port} {peer host name} {peer port}  

    起動例  
    Boot Example (Communicate A and B) 
    (Window A)  
    $ node node.js localhost 3001 localhost 3000
    (Window B)
    $ node node.js localhost 3000 localhost 3001
```

3.    コンソールから何か文字を入力すると、送金トランザクション（データのブロックチェーンへの保存）を行う  
    Make send a transaction (or save a data on BlockChain) with input on console.  


##  用語：
##  Words:
    コンソールログなどで使用
    Used in console logs

1.    RequestNode  
     = Client  
      要求を発信するノード  
      BlockChain Node that call requests  

1.    ListenNode  
     = Server  
      要求を受信するノード  
      BlockChain Node that receive requests  

##  確認環境：
##  Verified environment:
    Mac OS Mojave 10.14.4  
    node v9.11.1  
    npm 5.6.0 (have not depend on other npm modules.)  

    標準npmモジュールのみ使用しています。  
    Only use standard npm modules.  
