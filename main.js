const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data)
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    // podemos pasarle cualquier dato en 'previousHash' ya que no existe ninguno
    return new Block(0, "09/11/2019", "Genesis block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}
// un poquito de testing
let cyanCoin = new Blockchain();
cyanCoin.addBlock(new Block(1, "01/11/2019", { amount: 200 }));
cyanCoin.addBlock(new Block(2, "03/11/2019", { amount: 500 }));

console.log("is blockchain valid? ", cyanCoin.isChainValid());

cyanCoin.chain[1].data = { amount: 100 };
cyanCoin.chain[1].hash = cyanCoin.chain[1].calculateHash();

console.log("is blockchain valid? ", cyanCoin.isChainValid());

// console.log(JSON.stringify(cyanCoin, null, 4));
