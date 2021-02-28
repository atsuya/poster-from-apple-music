'use strict'

const fs = require('fs')
const path = require('path')

async function main() {
  const destination = process.argv[2]
  fs.mkdirSync(destination, { recursive: true })

  for (let index = 3; index < process.argv.length; index++) {
    const oldPath = process.argv[index]
    const fileExtension = path.extname(oldPath)
    const newPath = `${destination}/${index}${fileExtension}`

    console.log(`from: ${oldPath}, to: ${newPath}`)
    fs.renameSync(oldPath, newPath)
  }
}

main()
