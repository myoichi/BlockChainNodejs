/*
  BlockChainNodejs v0.01 Preview
  教育目的に限り、無料かつ自由にご利用ください。
  Only Free for Educational purpose

  著作権：
  Copyright:
    水口よういち
    Mizuguchi Yoichi
    Hachioji, Tokyo, Japan
    (c)2019 Mizuguchi Yoichi
 */
'use strict';
const fs = require('fs');
const util = require('util');
const constants = require('./constants');
const BlockChain = require('./blockChain');
const version = require('./version');
const Transaction = require('./transaction');

const NodeStatus = {
    StartUp : 0,
    Conected : 1,
    RequestedVersionCheck : 2,
    RequestedBlocks : 3,
    ReceivedBlocks : 4,
    RequestedTransfer : 5,
    Neutral : 6,
    Close : -1
};

// Class
module.exports = class RequestNodeStatus {
    constructor (obj={}) {
        this.nodeType = constants.NodeType.RequestNode;
        this.status = NodeStatus.StartUp;
        this.req = "";
        this.transfer = "";
        this.chain = "";
    }

    static get NodeType() {
        return constants.NodeType.RequestNode;
    }

    static get NodeStatus() {
        return NodeStatus;
    }

    updateStatus(status=null) {
        if (status != null) {
            this.status = status;
        } else {
            switch (this.status) {
                case NodeStatus.StartUp:
                    this.status = NodeStatus.Conected;
                    break;
                case NodeStatus.Conected:
                    this.status = NodeStatus.RequestedVersionCheck;
                    break;
                case NodeStatus.RequestedVersionCheck :
                    this.status = NodeStatus.RequestedBlocks;                        
                    break;
                case NodeStatus.RequestedBlocks :
                    this.status = NodeStatus.Neutral;
                    break;
                case NodeStatus.ReceivedBlocks :
                    break;
                case NodeStatus.RequestedTransfer :
                    this.status = NodeStatus.Neutral;
                    break;
                case NodeStatus.Neutral :
                    break;
                case NodeStatus.Close :
                    break;
            }            
        }
        console.log('Client: update Status:' + this.status);
    }

    /*
        meetConditions() == true の時のみ実行
     */
    write(socket) {
        switch (this.status) {
            case NodeStatus.StartUp:
                break;
            case NodeStatus.Conected:
                console.log('Client: write VersionNumber:' + util.inspect(version));
                socket.write(JSON.stringify(version));  // object -> テキスト
                break;
            case NodeStatus.RequestedVersionCheck :
                // ブロックを要求
                console.log('Client: write ReqBlock:' + constants.CommunicationText.ReqBlock);
                socket.write(JSON.stringify({req: constants.CommunicationText.ReqBlock}));  // object -> テキスト
                break;
            case NodeStatus.RequestedBlocks :
            case NodeStatus.Neutral :
                let chain = BlockChain;
                console.log('Client: save Received BlockChain' + util.inspect(chain));
                chain.addBlocksToBlockChain(this.chain);
                chain.writeFile();
                break;
            case NodeStatus.ReceivedBlocks :
                break;
            case NodeStatus.RequestedTransfer :
                break;
            case NodeStatus.Close :
                break;
        }
    }

    /*
        送金トランザクション
     */
    writeReqTransfer(socket) {
        // ブロック受信済みのとき
        // 入力値が数字のとき
        // 送金トランザクションに加工して送信
        let transaction = new Transaction(Transaction.sampleTransaction);
        console.log('Client: write ReqTransfer:' + util.inspect(transaction));
        socket.write(JSON.stringify({req: constants.CommunicationText.ReqTransfer, transfer: transaction}));  // object -> テキスト
    }

    //条件を満たしているか
    meetConditions(jsonData) {
        this.writed = false;
        switch (this.status) {
            case NodeStatus.StartUp:
            case NodeStatus.Conected:
                console.log('Client: Conected');
                return true;
                break;
            case NodeStatus.RequestedVersionCheck :
                if (jsonData.ack == constants.CommunicationText.Ack) {
                    console.log('Client: read Ackを受信 received Ack:' + jsonData.ack);
                    return true;
                } else {
                    console.log('Client: read Nakを受信 received Nak:' + jsonData.ack);
                    return false;
                }
                break;
            case NodeStatus.RequestedBlocks :
                if (jsonData.ack == constants.CommunicationText.ReqBlock) {
                    // ブロックを受信
                    console.log('Client: read ブロックを受信 received blocks:' + jsonData.ack);
                    this.chain = jsonData.chain;
                    return true;
                } else {
                    console.log('Client: read Any:' + util.inspect(jsonData));
                    return false;
                }
                break;
            case NodeStatus.ReceivedBlocks :
                return true;
                break;
            case NodeStatus.RequestedTransfer :
                if (jsonData.ack == constants.CommunicationText.ReqBlock) {
                    // ブロックを受信
                    console.log('Client: read ブロックを受信 received blocks:' + jsonData.ack);
                    this.chain = jsonData.chain;
                    return true;
                } else {
                    console.log('Client: read Any:' + util.inspect(jsonData));
                    return false;
                }
                break;
            case NodeStatus.Neutral :
                return true;
                break;
            case NodeStatus.Close :
                break;
        }
    }
};
