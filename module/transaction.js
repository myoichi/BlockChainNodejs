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
// Object
const sampleTransaction = {
    hashTransaction : 'JielDk3k3kz9dkz9dk84lDID84lDID30',
    hashPreTransaction : '',                // sha256, top transaction is empty
    command : 'transfer',                   // 'transfer' is fixed string, this property for scalability
    publicKeyOwner : '73kz8392kd9a',        // genarated by private key (ecdsa256)
    publicKeyEndPoint : 'aeiekd8als',       // genarated by private key (ecdsa256)
    transferValue : 200.38,                 // unit is 'schoolMoney', minimum unit is 0.01 SM
    chargeSetByOwner : 0.01,                // unit is 'schoolMoney', minimum unit is 0.01 SM

    hashPostTransaction : 'ckei92aSI92'     // sha256, last transaction is empty
};

// Class
module.exports = class Transaction {
    constructor (transactionObject={}) {
        this.hashTransaction = transactionObject.hashTransaction;
        this.hashPreTransaction = transactionObject.hashPreTransaction;   // sha256, top transaction is empty

        this.command = transactionObject.command;                         // 'transfer' is fixed string, this property for scalability
        this.publicKeyOwner = transactionObject.publicKeyOwner;           // genarated by private key (ecdsa256)
        this.publicKeyEndPoint = transactionObject.publicKeyEndPoint;     // genarated by private key (ecdsa256)
        this.transferValue = transactionObject.transferValue;             // unit is 'schoolMoney', minimum unit is 0.01 SM
        this.chargeSetByOwner = transactionObject.chargeSetByOwner;       // unit is 'schoolMoney', minimum unit is 0.01 SM

        this.hashPostTransaction = transactionObject.hashPostTransaction; // sha256, last transaction is empty
    }

    static get sampleTransaction() {
        return sampleTransaction;
    }

    getHashTransaction() {
        if (this.hashTransaction == "") return this.genarateHashTransaction();
        return this.hashTransaction;
    }

    genarateHashTransaction() {
        // sha256
        return 'JielDk3k3kz9dkz9dk84lDID84lDID30';             // sha256        
    }
}
