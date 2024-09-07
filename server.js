const express = require('express')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

app.use("/assets", express.static(path.resolve(__dirname, "frontend", "assets")))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "index.html"))
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = app
