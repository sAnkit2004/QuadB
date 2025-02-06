const crypto = require('crypto');

// Block class
class Block {
    constructor(index, timestamp, transactions, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; // For proof-of-work
    }

    // Calculate the hash of the block
    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(
                this.index +
                this.timestamp +
                JSON.stringify(this.transactions) +
                this.previousHash +
                this.nonce
            )
            .digest('hex');
    }

    // Proof-of-work mechanism
    mineBlock(difficulty) {
        while (
            this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
        ) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Block mined: ${this.hash}`);
    }
}

// Blockchain class
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4; // Difficulty for proof-of-work
        this.pendingTransactions = [];
    }

    // Create the genesis block
    createGenesisBlock() {
        return new Block(0, Date.now(), [], '0');
    }

    // Get the latest block in the chain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Add a new block to the chain
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty); // Mine the block
        this.chain.push(newBlock);
    }

    // Validate the integrity of the blockchain
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Check if the current block's hash is valid
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            // Check if the previous hash matches
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

    // Tamper with a block to demonstrate validation
    tamperBlock(blockIndex, newTransaction) {
        this.chain[blockIndex].transactions.push(newTransaction);
        this.chain[blockIndex].hash = this.chain[blockIndex].calculateHash();
    }
}

// Example usage
const myBlockchain = new Blockchain();

console.log('Mining block 1...');
myBlockchain.addBlock(new Block(1, Date.now(), ['Transaction 1']));

console.log('Mining block 2...');
myBlockchain.addBlock(new Block(2, Date.now(), ['Transaction 2']));

// Print the blockchain
console.log(JSON.stringify(myBlockchain, null, 2));

// Validate the blockchain
console.log('Is blockchain valid?', myBlockchain.isChainValid());

// Tamper with the blockchain
console.log('Tampering with block 1...');
myBlockchain.tamperBlock(1, 'Tampered transaction');

// Validate the blockchain after tampering
console.log('Is blockchain valid?', myBlockchain.isChainValid());