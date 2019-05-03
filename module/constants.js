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
const CommunicationText = {
    Ack : "ACK",
    Nak : "NAK",
    ReqBlock : "RQB",
    ReqTransfer : "RTF"
};
module.exports.CommunicationText = CommunicationText;

const File = {
    BlockChainFile : "blockChain.json"
};
module.exports.File = File;

const NodeType = {
    ListenNode : 0,
    RequestNode : 1
};
module.exports.NodeType = NodeType;
