const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        this.nonce +
        JSON.stringify(this.data)
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Bloque minado: ", this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 5;
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
    newBlock.mineBlock(this.difficulty);
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
// blockchain testing

// instanciamos nuestra blockchain
let cyanCoin = new Blockchain();

console.log("minando bloque 1 ... ");
cyanCoin.addBlock(new Block(1, "01/11/2019", { amount: 200 }));

console.log("minando bloque 2 ... ");
cyanCoin.addBlock(new Block(2, "03/11/2019", { amount: 500 }));

// verificamos que el blockchain sea valido
console.log("is blockchain valid? ", cyanCoin.isChainValid());

cyanCoin.chain[1].data = { amount: 100 };
cyanCoin.chain[1].hash = cyanCoin.chain[1].calculateHash();

// vemos nuevamente si el blockchain es valido, luego de haberlo alterado.
console.log("is blockchain valid? ", cyanCoin.isChainValid());

// vemos el contenido de toda nuestra blockchain
// console.log(JSON.stringify(cyanCoin, null, 4));
