export async function minimizeWindow() {
  await window.api.windowControl.minimize()
}

export async function maximizeWindow() {
  return await window.api.windowControl.maximize()
}

export async function closeWindow() {
  await window.api.windowControl.close()
}

export async function isWindowMaximized() {
  return await window.api.windowControl.isMaximized()
}
