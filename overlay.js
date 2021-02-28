'use strict'

const sharp = require('sharp')

const CANVAS_WIDTH = 3508
const CANVAS_HEIGHT = 4961
const IMAGE_WIDTH = 701
const IMAGE_HEIGHT = 701
const IMAGES_PER_ROW = 5
const NUMBER_OF_ROWS = 7
const MAX_NUMBER_OF_IMAGES = IMAGES_PER_ROW * NUMBER_OF_ROWS

async function createOverlayImages(images) {
  const overlayImages = []
  for (let index = 0; index < images.length; index++) {
    const image = images[index]
    const column = index % IMAGES_PER_ROW
    const row = Math.floor(index / IMAGES_PER_ROW)
    const top = row * IMAGE_HEIGHT
    const left = column * IMAGE_WIDTH
    console.log(`overlaying: c=${column}, r=${row}, t=${top}, l=${left}`)

    // resize the image
    const buffer = await image
      .resize({
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
      })
      .toBuffer()
    overlayImages.push({
      input: buffer,
      top: top,
      left: left,
    })
  }

  return overlayImages
}

async function createPoster(images, outputFilePath) {
  const canvas = sharp({
      create: {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        channels: 3,
        background: {
          r: 0,
          g: 0,
          b: 0,
        },
      },
    })

  const overlayImages = await createOverlayImages(images)

  console.log(`generating output: ${outputFilePath}`)
  await canvas
    .composite(overlayImages)
    .sharpen()
    .toFile(outputFilePath)
}

async function main() {
  const imagePaths = []
  for (let index = 2; index < process.argv.length; index++) {
    if (imagePaths.length > MAX_NUMBER_OF_IMAGES) {
      console.log(
          `too many images are supplied, caping it at ${MAX_NUMBER_OF_IMAGES}`)
      break
    }

    console.log(`adding: ${process.argv[index]}`)
    imagePaths.push(process.argv[index])
  }

  const images = imagePaths.map((imagePath) => {
    return sharp(imagePath)
  })
  await createPoster(images, './poster2.jpg')
}

main()
