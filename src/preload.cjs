const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('radar', {
  showWindow: () => ipcRenderer.invoke('startup:show'),
  mapTile: q => ipcRenderer.invoke('map:tile',q),
  satellites: () => ipcRenderer.invoke('satellites'),
  metadata: q => ipcRenderer.invoke('metadata',q),
  airportBoard: q => ipcRenderer.invoke('airport-board',q),
  traffic: query => ipcRenderer.invoke('traffic', query),
  readSettings: () => ipcRenderer.invoke('settings:read'),
  writeSettings: settings => ipcRenderer.invoke('settings:write', settings),
  export: payload => ipcRenderer.invoke('export', payload),
  external: name => ipcRenderer.invoke('external', name)
});

