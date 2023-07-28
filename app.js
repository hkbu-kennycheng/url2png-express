const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const { mkdirp } = require('mkdirp')
const { spawn } = require('child_process')

async function runPuppeteer (data) {
  const jsonData = JSON.stringify(data)
  const b64Data = Buffer.from(jsonData).toString('base64')
  //  let stdoutData = ''
  return await new Promise((resolve) => {
    const p = spawn('node', [
      path.resolve(__dirname, 'puppeteerWorker.js'),
      `--input-data${b64Data}`,
      '--tagprocess'
    ], { shell: false })
    //    p.stdout.on('data', (data) => {
    //      stdoutData += data
    //    })
    p.stderr.on('data', (data) => {
      console.error(`NodeERR: ${data}`)
    })
    p.on('close', async (code) => {
    })
    p.on('exit', function () {
      p.kill()
      resolve()
    })
  })
}

app.get('*', async (req, res) => {
  let url = req.path.substring(1) || 'ddg.gg'
  const parts = url.split('/')
  let width = 1280
  let height = 720

  const prefix = '/tmp/url2png/'
  const dir = prefix + path.dirname(url)
  const filename = prefix + `${url}.png`
  if (dir) {
    mkdirp(dir)
  }

  if (fs.existsSync(filename)) {
    return res.sendFile(filename)
  }

  if (parts[0] && parseInt(parts[0])) {
    width = parseInt(parts[0])
    parts.splice(0, 1)
    url = parts.join('/')
    if (parts[0] && parseInt(parts[0])) {
      height = parseInt(parts[0])
      parts.splice(0, 1)
      url = parts.join('/')
    } else {
      height = Math.ceil(width / 16 * 9)
    }
  }

  await runPuppeteer({
    url,
    width,
    height,
    filename
  })

  if (fs.existsSync(filename)) {
    return res.sendFile(filename)
  }
  return res.sendStatus(404)
})

app.listen(3000, () => {
  console.log('Listen on the port 3000...')
})
