'use strict'

/* global chrome */

async function pickColor () {
  if (!window.EyeDropper) {
    window.alert(chrome.i18n.getMessage('EYEDROPPER_SUPPORT_ERROR'))
    return
  }

  const eyeDropper = new window.EyeDropper()

  try {
    const result = await eyeDropper.open()
    chrome.runtime.sendMessage({ color: result.sRGBHex, context: 'page_color' })
  } catch (error) {
    console.error('Error using EyeDropper:', error)
    return null
  }
}

pickColor()
