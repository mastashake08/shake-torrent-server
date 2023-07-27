#!/usr/bin/env node

import WebTorrent from 'webtorrent-hybrid'
import express from 'express'
import cors from 'cors'
const client = new WebTorrent()
const app = express()
app.use(express.json())
app.use(cors({
    origin: '*'
}));
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.post('/add', (req, res) => {
  const tor = req.body.torrent
  client.add(tor, (torrent) => {
  torrent.on('done', () => {
    console.log('torrent download finished')
  })
  torrent.on('download', () => {
    console.log('Downloaded:::', torrent.progress * 100)
  })
  torrent.on('upload', function (bytes) {
    console.log(`${bytes} bytes uploaded`)
  })
  torrent.on('wire', (wire, addr) => {
  console.log('connected to peer with address ' + [wire,addr])
})
res.json({magnetUri: torrent.magnetURI})
})

})
app.post('/seed', (req, res) => {
  client.seed(req.body.torrentId, (torrent) => {
     console.log('Client is seeding ' + torrent.magnetURI)
 })
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
