'use strict'

/* global chrome, Audio */

chrome.runtime.onMessage.addListener(onMessageReceived)

async function onMessageReceived (message) {
  if (message.context !== 'offscreen') {
    return
  }

  if (message.type === 'write_to_clipboard') {
    writeToClipboard(message.data)
  } else if (message.type === 'play_sound') {
    playSound(message.sound)
  }
}

function writeToClipboard (data) {
  try {
    const textEl = document.getElementById('text')
    textEl.value = data
    textEl.select()
    document.execCommand('copy')
    playSound()
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

function playSound () {
  const playable = new Audio(chrome.runtime.getURL('./offscreen/audio/pick_color.mp3'))
  playable.play()
}
