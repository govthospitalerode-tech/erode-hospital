{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/waste", "dest": "/server.js" },
    { "src": "/hospital", "dest": "/server.js" },
    { "src": "/(.*)", "dest": "/server.js" }
  ]
}