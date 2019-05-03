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
const Block = require('./block');
const BlockChain = require('./blockChain');

const NodeStatus = {
    StartUp : 0,
    Listening : 1,
    WaitForListening : 2,
    SentBlocks : 3,
    AddingBlock : 4,            // so-called 'mining'
    AddedBlock : 5,
    PeerClosed : -1
};

// Class
module.exports = class ListenNodeStatus {
    constructor (obj={}) {
        this.nodeType = constants.NodeType.ListenNode;
        this.status = NodeStatus.StartUp;
        this.req = "";
        this.transfer = "";
    }

    static get NodeType() {
        return constants.NodeType.ListenNode;
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
                case NodeStatus.PeerClosed :
                    this.status = NodeStatus.WaitForListening;
                    break;
                case NodeStatus.Listening :
                    break;
                case NodeStatus.WaitForListening :
                    if (this.req == constants.CommunicationText.ReqBlock) {
                    } else if (this.req == constants.CommunicationText.ReqTransfer) {
                    }
                    break;
                case NodeStatus.SentBlocks :
                    break;
                case NodeStatus.AddingBlock :   // so-called 'mining'
                    break;
                case NodeStatus.AddedBlock :
                    break;
            }
        }
        console.log('Server: update Status:' + this.status);
    }

    write(socket, meetCondition) {
        const ack = JSON.stringify({ack: constants.CommunicationText.Ack});
        const nak = JSON.stringify({ack: constants.CommunicationText.Nak});

        switch (this.status) {
            case NodeStatus.StartUp:
            case NodeStatus.PeerClosed :
                if (meetCondition) {
                    console.log('Server: write Ack:' + ack);
                    socket.write(ack);
                } else {
                    console.log('Server: write Nak:' + nak);
                    socket.write(nak);
                }
                break;
            case NodeStatus.Listening :
                break;
            case NodeStatus.WaitForListening :
                if (this.req == constants.CommunicationText.ReqBlock) {
                    console.log('Server: read ブロックチェーン同期要求を受信 received BlockChain sync request:' + this.req);
                    fs.readFile(constants.File.BlockChainFile, function (error, blockData) {
                        if (error) {
                        } else {
                            blockData = JSON.parse(blockData);
                            console.log('Server: write Blocks:' + util.inspect(blockData));
                            socket.write(JSON.stringify({ack: constants.CommunicationText.ReqBlock, chain: blockData}));
                        }
                    });
                } else if (this.req == constants.CommunicationText.ReqTransfer) {
                    console.log('Server: read 送金要求（トランザクション）を受信 received a transaction:' + this.req);
                    // 送金要求（トランザクション）を受信
                    // 新ブロック（チェーン未追加）を生成していなければ、生成する
                    let block = new Block();
                    block.addTransaction(this.transfer);
                    // ブロックにトランザクションを追加する
                    let blockChain = BlockChain;
                    console.log(blockChain);
                    blockChain.addToBlockChain(block);
                    // ブロックチェーンを送信（ブロードキャスト）
                    console.log('Server: write Blocks:' + util.inspect(blockChain));
                    socket.write(JSON.stringify({ack: constants.CommunicationText.ReqBlock, chain: blockChain}));
                }
                break;
            case NodeStatus.SentBlocks :
                break;
            case NodeStatus.AddingBlock :   // so-called 'mining'
                break;
            case NodeStatus.AddedBlock :
                break;
        }
    }

    //条件を満たしているか
    meetConditions(jsonData) {
        switch (this.status) {
            case NodeStatus.StartUp:
            case NodeStatus.PeerClosed :
                if (jsonData.versionNumber != undefined) {
                    console.log('Server: read versionNumber:' + jsonData.versionNumber);
                    return true;
                } else {
                    console.log('Server: read Any:' + util.inspect(jsonData));
                    return false;
                }
                break;
            case NodeStatus.Listening :
                break;
            case NodeStatus.WaitForListening :  //VersionChecked
                if (jsonData.req == constants.CommunicationText.ReqBlock
                || jsonData.req == constants.CommunicationText.ReqTransfer) {
                    console.log('Server: read Any Request' + jsonData.req);
                    this.req = jsonData.req;
                    this.transfer = jsonData.transfer;
                    return true;
                } else {
                    console.log('Server: read Any:' + util.inspect(jsonData));
                    return false;
                }
                break;
            case NodeStatus.SentBlocks :
                break;
            case NodeStatus.AddingBlock :   // so-called 'mining'
                break;
            case NodeStatus.AddedBlock :
                break;
        }
    }
};
