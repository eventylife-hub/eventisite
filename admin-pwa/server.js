#!/usr/bin/env node
/**
 * Serveur local pour tester la PWA Eventy Admin
 * Usage : node server.js
 * Puis ouvrir http://localhost:3000 ou scanner le QR code affiché
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;
const DIR = __dirname;

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.css': 'text/css',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(DIR, req.url === '/' ? '/index.html' : req.url);
  const ext = path.extname(filePath);

  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIR, 'index.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/html' });
    res.end(data);
  });
});

// Get local IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
    }
  }
  return 'localhost';
}

server.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIP();
  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║       🟠 EVENTY ADMIN PWA               ║');
  console.log('  ╠══════════════════════════════════════════╣');
  console.log(`  ║  Local:   http://localhost:${PORT}          ║`);
  console.log(`  ║  Réseau:  http://${ip}:${PORT}     ║`);
  console.log('  ║                                          ║');
  console.log('  ║  📱 Scanne le QR code sur ton tel :      ║');
  console.log(`  ║  Ouvre qr-code.html dans ton navigateur  ║`);
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
  console.log('  (Ctrl+C pour arrêter)');
});
