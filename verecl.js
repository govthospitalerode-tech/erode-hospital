{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" },
    { "src": "*.html", "use": "@vercel/static" },
    { "src": "*.css", "use": "@vercel/static" },
    { "src": "*.js", "use": "@vercel/static" },
    { "src": "*.json", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/waste", "dest": "/server.js" },
    { "src": "/hospital", "dest": "/server.js" },

    { "src": "/shared.js", "dest": "/shared.js" },
    { "src": "/firebase.config.js", "dest": "/firebase.config.js" },
    { "src": "/hospital.js", "dest": "/hospital.js" },
    { "src": "/waste.js", "dest": "/waste.js" },

    { "src": "/hospital.json", "dest": "/hospital.json" },
    { "src": "/waste.json", "dest": "/waste.json" },

    { "src": "/style.css", "dest": "/style.css" },

    { "src": "/(.*\\.html)", "dest": "/$1" },

    { "src": "/(.*)", "dest": "/server.js" }
  ]
}