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

const constants = require('./constants');
const Transaction = require('./transaction');
const fs = require('fs');

// Origin Block Object
const originBlock = {
    hashBlock : 'JielDk3k3kz9dkz9dk84lDID84lDID30',             // sha256
    hashPreBlock : '',                                          // sha256, genesis block is empty
    transactions : [],                                          // transaction
    publicKeyBlockAuther : '38akdia38akdi38akdiaISAaISAISA0s',  // genarated by private key (ecdsa256)
    signBlockAuther : '8SK9a8zkei3983ISuUcKE843kjeloaAo'        // 32chars hash the block (sha256) -> significate (ecdsa256)
};

// Class
module.exports = class Block {
    constructor (blockObject={}) {
        this.hashBlock = blockObject.hashBlock;                         // sha256
        this.hashPreBlock = blockObject.hashPreBlock;                   // sha256, genesis block is empty
        this.transactions = [];                                         // transaction     
        this.publicKeyBlockAuther = blockObject.publicKeyBlockAuther;   // genarated by private key (ecdsa256)
        this.signBlockAuther = blockObject.signBlockAuther;             // hash the block (sha256) -> significate (ecdsa256)     
    }

    static get originBlock() {
        return originBlock;
    }

    getHashBlock() {
        if (this.hashBlock == "") return this.genarateHashBlock();
        return this.hashBlock;
    }

    genarateHashBlock() {
        // sha256
        return 'JielDk3k3kz9dkz9dk84lDID84lDID30';             // sha256
    }

    addTransaction(transfer) {
        // 送金情報を加工
        const transaction = new Transaction(transfer);
        // トランザクション配列に追加
        this.transactions.push(transaction);
    }
}
