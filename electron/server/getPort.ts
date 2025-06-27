// import getPort from 'get-port'

// 默认端口
let webPort: number
let servePort: number

async function getSafePort() {
  if (webPort && servePort) {
    return { webPort, servePort }
  }
  // webPort = await getPort({ port: import.meta.env.VITE_WEB_PORT || 14558 })
  // @ts-expect-error non
  webPort = import.meta.env.VITE_WEB_PORT || 14558
  // @ts-expect-error non
  // servePort = await getPort({ port: import.meta.env.VITE_SERVER_PORT || 25884 })
  servePort = import.meta.env.VITE_SERVER_PORT || 25884

  return {
    webPort,
    servePort,
  }
}

export {
  getSafePort,
}
