
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
  try {
    const tor = req.body.torrent
    client.add(tor, (torrent) => {
    torrent.on('done', () => {
      console.log(`${torrent.name} download finished'`)
    })
    torrent.on('download', (bytes) => {
      console.log(`Downloading ${torrent.name}`, torrent.progress * 100)
      console.log('just downloaded: ' + bytes)
      console.log('total downloaded: ' + torrent.downloaded)
      console.log('download speed: ' + torrent.downloadSpeed)
     })
    torrent.on('upload', function (bytes) {
      console.log(`${bytes} bytes uploaded for ${torrent.name}`)
    })
    torrent.on('noPeers', function (announceType) {
      torrent.destroy()
    })
      res.json({magnetUri: torrent.magnetURI})
    })
    } catch(e) {
      console.log(e)
    }

  })
app.post('/seed', (req, res) => {
  client.seed(req.body.torrentId, (torrent) => {
     console.log('Client is seeding ' + torrent.magnetURI)
     res.send(torrent.magnetURI)
 })
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log(client.torrents)
})
