'use strict'

/* global chrome, self, OffscreenCanvas, Path2D */

import * as promisify from './promisify.js'
import * as menu from './menu.js'
import * as color from './color.js'

chrome.runtime.onInstalled.addListener(onInstalled)
chrome.runtime.onStartup.addListener(onStartup)
chrome.action.onClicked.addListener(onActionClicked)
chrome.runtime.onMessage.addListener(onMessageReceived)
chrome.contextMenus.onClicked.addListener(onMenuClicked)

async function onInstalled () {
  await setDeclarativeContent()
  await setActionTitle()

  // Construct menu
  for (const menuItem of menu.menuItems) {
    await promisify.menuCreate(menuItem)
  }

  await updateMenu()
}

async function setActionTitle () {
  const platformInfo = await promisify.getPlatformInfo()
  let actionTitle

  if (platformInfo.os === 'mac') {
    actionTitle = `${chrome.i18n.getMessage('EXT_NAME_SHORT')} (${chrome.i18n.getMessage('ACCELERATOR_COLOR_MAC')})`
  } else {
    actionTitle = `${chrome.i18n.getMessage('EXT_NAME_SHORT')} (${chrome.i18n.getMessage('ACCELERATOR_COLOR')})`
  }

  await promisify.actionSetTitle({ title: actionTitle })
}

async function onStartup () {
  await setDeclarativeContent()
  await updateMenu()
}

async function setDeclarativeContent () {
  // By setting declarative content the action icon is disabled on URLs that wont allow content scripts to be injected
  // For example chrome:// or edge:// urls
  await promisify.actionDisable()

  try {
    await promisify.onPageChangedRemoveRules(undefined)

    const rules = {
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { schemes: ['http', 'https', 'file', 'ftp'] }
        })
      ],
      actions: [new chrome.declarativeContent.ShowAction()]
    }

    await promisify.onPageChangedAddRules([rules])
  } catch (error) {
    console.error(error)
  }
}

async function updateMenu () {
  const colorFormatPreference = await promisify.storageLocalGet({ color_format: 'hex' })
  console.log(colorFormatPreference)
  await promisify.menuUpdate(colorFormatPreference.color_format, { checked: true })
}

async function onActionClicked (tab) {
  if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://')) return

  await promisify.executeScript({
    target: { tabId: tab.id },
    files: ['./scripts/content.js']
  })
}

async function onMessageReceived (message, sender, sendResponse) {
  if (message.context === 'page_color') {
    const pickedColor = message.color
    // Get correct format
    const colorFormatPreference = await promisify.storageLocalGet({ color_format: 'hex' })
    const formattedColor = color.convertColor(pickedColor, colorFormatPreference.color_format)

    await updateIcon(pickedColor)

    const documentPath = chrome.runtime.getURL('offscreen/offscreen.html')
    const hasDocument = await hasOffscreenDocument(documentPath)

    if (!hasDocument) {
      try {
        await promisify.offscreenCreateDocument({
          url: documentPath,
          reasons: ['CLIPBOARD', 'AUDIO_PLAYBACK'],
          justification: 'Write text to the clipboard and play a sound'
        })
      } catch (error) {
        console.error(error)
      }
    }

    try {
      chrome.runtime.sendMessage({ data: formattedColor, type: 'write_to_clipboard', context: 'offscreen' })
    } catch (error) {
      console.error(error)
    }
  }
}

async function hasOffscreenDocument (path) {
  let matchedClients

  try {
    matchedClients = await self.clients.matchAll()
  } catch (error) {
    console.error(error)
    return false
  }

  for (const client of matchedClients) {
    if (client.url === path) {
      return true
    }
  }

  return false
}

async function updateIcon (pickedColor) {
  const canvasSize = 32

  const canvas = new OffscreenCanvas(canvasSize, canvasSize)
  const ctx = canvas.getContext('2d')

  const svgPath = new Path2D('M29 19C29 26.1797 23.1797 32 16 32C8.8203 32 3 26.1797 3 19C3 11.5223 11.6261 3.61958 14.825 0.9461C15.5109 0.372785 16.4891 0.372784 17.175 0.946099C20.3739 3.61958 29 11.5223 29 19Z')
  ctx.fillStyle = pickedColor
  ctx.fill(svgPath)

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'
  ctx.lineWidth = 2
  ctx.stroke(svgPath)

  const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize)
  await promisify.actionSetIcon({ imageData })
}

async function onMenuClicked (info) {
  const { parentMenuItemId, menuItemId, checked } = info

  if (parentMenuItemId === 'color_format' && checked) {
    await promisify.storageLocalSet({ color_format: menuItemId })
  }
}
