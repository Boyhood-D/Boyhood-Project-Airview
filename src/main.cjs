'use strict';
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const { traffic } = require('./network.cjs');
const space = require('./space-network.cjs');
const maps = require('./map-network.cjs').createMapService();
const dataDir = path.join(app.isPackaged ? path.dirname(app.getPath('exe')) : app.getAppPath(), 'Airview-data');
try { fs.mkdirSync(dataDir, { recursive: true }); app.setPath('userData', dataDir); app.setPath('sessionData', path.join(dataDir, 'cache')); }
catch { dialog.showErrorBox('Folder is not writable', 'Extract Airview to a writable folder and restart it.'); app.exit(1); }
require('./network.cjs').configureBudgetDir(dataDir);
app.setAppUserModelId('Airview.Desktop');
// Canvas rendering does not need a discrete GPU. This avoids black windows on
// remote desktops and some Windows graphics drivers while preserving Chromium's sandbox.
if(process.argv.includes('--software-rendering')) app.disableHardwareAcceleration();
const diagnosticPath = path.join(dataDir, 'diagnostics.log');
function diagnostic(message) { try { if(fs.existsSync(diagnosticPath) && fs.statSync(diagnosticPath).size > 100000) fs.writeFileSync(diagnosticPath,''); fs.appendFileSync(diagnosticPath,new Date().toISOString()+' '+message+'\n'); } catch {} }
process.on('uncaughtException', error => diagnostic('Main error: '+error.message));
let win,markWindowShown;
const windowShown=new Promise(resolve=>{markWindowShown=resolve;});
const settingsPath = path.join(dataDir, 'settings.json');
function loadSettings() { try { return JSON.parse(fs.readFileSync(settingsPath, 'utf8')); } catch { return {}; } }
app.whenReady().then(() => {
  win = new BrowserWindow({ width: 1500, height: 960, minWidth: 1040, minHeight: 700, backgroundColor: '#080e19', title: 'Airview', show:false, icon:path.join(__dirname,'../assets/icon.png'), autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true, spellcheck: false } });
  win.once('ready-to-show',()=>{win.show();markWindowShown(true);});
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', (e,url) => {
    const allowed=['index.html'].map(name=>require('node:url').pathToFileURL(path.join(__dirname,name)).href);
    const canonical=value=>process.platform==='win32'?value.toLowerCase():value;
    if(!allowed.some(value=>canonical(value)===canonical(url)))e.preventDefault();
  });
  win.webContents.session.setPermissionRequestHandler((_web, _permission, callback) => callback(false));
  win.webContents.on('did-fail-load', (_event, code, description) => diagnostic('Load error: '+code+' '+description));
  win.webContents.on('render-process-gone', (_event, details) => diagnostic('Renderer stopped: '+details.reason));
  win.webContents.on('console-message', (_event, details) => { if(details.level === 'error') diagnostic('Renderer: '+details.message); });
  diagnostic('Starting Airview '+app.getVersion());
  win.loadFile(path.join(__dirname, 'index.html')).catch(error=>diagnostic('Page load failed: '+error.message));
});
app.on('window-all-closed', () => app.quit());
ipcMain.handle('startup:show', () => windowShown);
ipcMain.handle('map:tile', (_event,q) => maps.tile(q,dataDir));
ipcMain.handle('satellites', () => space.satellites(dataDir));
ipcMain.handle('metadata', (_e,q) => space.metadata(q));
ipcMain.handle('airport-board', (_e,q) => space.airportBoard(q));
ipcMain.handle('traffic', (_event, query) => traffic(query));
ipcMain.handle('settings:read', () => loadSettings());
ipcMain.handle('settings:write', (_event, settings) => {
  if (!settings || typeof settings !== 'object' || JSON.stringify(settings).length > 100000) return false;
  try { const temp = settingsPath + '.tmp'; fs.writeFileSync(temp, JSON.stringify(settings, null, 2)); fs.renameSync(temp, settingsPath); return true; } catch { return false; }
});
ipcMain.handle('export', async (_event, payload) => {
  if (!payload || typeof payload.content !== 'string' || payload.content.length > 20000000) return false;
  const ext = payload.format === 'json' ? 'json' : 'csv';
  const save = await dialog.showSaveDialog(win, { defaultPath: `Airview-${new Date().toISOString().slice(0, 10)}.${ext}`, filters: [{ name: ext.toUpperCase(), extensions: [ext] }] });
  if (save.canceled) return false;
  try { fs.writeFileSync(save.filePath, payload.content, 'utf8'); return true; } catch { return false; }
});
ipcMain.handle('external', (_event, name) => {
  const links = { adsb: 'https://www.adsb.lol', opensky: 'https://opensky-network.org', github: 'https://github.com/Boyhood-D/Boyhood-Project-Airview', osm:'https://www.openstreetmap.org/copyright', eox:'https://maps.eox.at/', swiss:'https://www.swisstopo.admin.ch/en/swissimage-the-digital-colour-orthophotomosaic', mapissue:'https://www.openstreetmap.org/fixthemap' };
  if (links[name]) shell.openExternal(links[name]);
});

