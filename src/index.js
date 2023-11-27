const express = require('express')
const cors = require('cors')

const app = express()

//Config JSON response
app.use(express.json())

//Solver CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

//Public folder for images
app.use(express.static('public'))

//Routes
const UserRoutes = require('./routes/UserRoutes')
const ArticleRoutes = require('./routes/ArticleRoutes')

app.use('/users', UserRoutes)
app.use('/articles', ArticleRoutes)


app.listen(5000)