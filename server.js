const express = require('express')
const app = express()
const port = process.env.PORT || 3306
const bodyParser = require('body-parser')
const passport = require('passport')

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(passport.initialize())
require('./middleware/passport')(passport)

const routes = require('./setting/routes')
routes(app)

app.listen(port, () => {
    console.log(`App listen on port ${port}`);
})