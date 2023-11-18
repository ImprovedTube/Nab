'use strict'

/* global chrome */

export const sendMessage = promisifyChromeMethod(chrome.runtime.sendMessage.bind(chrome.runtime))
export const executeScript = promisifyChromeMethod(chrome.scripting.executeScript.bind(chrome.scripting))
export const storageLocalGet = promisifyChromeMethod(chrome.storage.local.get.bind(chrome.storage.local))
export const storageLocalSet = promisifyChromeMethod(chrome.storage.local.set.bind(chrome.storage.local))
export const offscreenCreateDocument = promisifyChromeMethod(chrome.offscreen.createDocument.bind(chrome.offscreen))
export const offscreenCloseDocument = promisifyChromeMethod(chrome.offscreen.closeDocument.bind(chrome.offscreen))
export const actionSetIcon = promisifyChromeMethod(chrome.action.setIcon.bind(chrome.action))
export const onPageChangedRemoveRules = promisifyChromeMethod(chrome.declarativeContent.onPageChanged.removeRules.bind(chrome.declarativeContent.onPageChanged))
export const onPageChangedAddRules = promisifyChromeMethod(chrome.declarativeContent.onPageChanged.addRules.bind(chrome.declarativeContent.onPageChanged))
export const actionDisable = promisifyChromeMethod(chrome.action.disable.bind(chrome.action))
export const menuCreate = promisifyChromeMethod(chrome.contextMenus.create.bind(chrome.contextMenus))
export const menuUpdate = promisifyChromeMethod(chrome.contextMenus.update.bind(chrome.contextMenus))
export const getPlatformInfo = promisifyChromeMethod(chrome.runtime.getPlatformInfo.bind(chrome.runtime))
export const actionSetTitle = promisifyChromeMethod(chrome.action.setTitle.bind(chrome.action))

function promisifyChromeMethod (method) {
  return (...args) =>
    new Promise((resolve, reject) => {
      method(...args, (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message || JSON.stringify(chrome.runtime.lastError)))
        } else {
          resolve(result)
        }
      })
    })
}
