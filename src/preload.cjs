const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('radar', {
  traffic: query => ipcRenderer.invoke('traffic', query),
  readSettings: () => ipcRenderer.invoke('settings:read'),
  writeSettings: settings => ipcRenderer.invoke('settings:write', settings),
  export: payload => ipcRenderer.invoke('export', payload),
  external: name => ipcRenderer.invoke('external', name)
});
