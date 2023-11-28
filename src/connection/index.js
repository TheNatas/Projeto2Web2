const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config();

async function main() {
  await mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_KEY}@cluster0.kignbiq.mongodb.net/?retryWrites=true&w=majority`)
  console.log('Conectou com Mongoose!')
}

main().catch((err) => console.log(err))

module.exports = mongoose