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
const Block = require('./block');
const fs = require('fs');

// Singleton Class
class BlockChain extends Map {
    constructor(blockObjects=[]) {
        // オリジンブロックを生成する
        let block = new Block(Block.originBlock);
        blockObjects = [[block.hashBlock, block]];
        super(blockObjects);
    }

    isExistFile(file) {
        try {
          fs.statSync(file);
          return true
        } catch(error) {
          if(error.code === 'ENOENT') return false
        }
    }

    writeFile() {
        /*
            Map to Json Array
        */
        const mapToAoO = m => {
            return Array.from(m).map( ([k,v]) => {return {[k]:v}} );
        };

        if (!this.isExistFile(constants.File.BlockChainFile)) {
            fs.writeFile(constants.File.BlockChainFile, JSON.stringify(mapToAoO(this), null, 2));
        }
    }

    readFile() {
        if (!this.isExistFile(constants.File.BlockChainFile)) {
            fs.readFile(constants.File.BlockChainFile, function (error, blockData) {
                if (error) {
                } else {
                    blockData = JSON.parse(blockData);
                    return blockData;
                }
            });
        }
    }

    addToBlockChain(block) {
        if (block.constructor instanceof Block) this.set(block.hashBlock, block);
    }

    /*
        #todo ブロック重複チェック
     */
    addBlocksToBlockChain(blocks) {
        blocks.forEach(block => {
            if (block.constructor instanceof Block) this.set(block.hashBlock, block);            
        });
    }
}
module.exports = new BlockChain();
