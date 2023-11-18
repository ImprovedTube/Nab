'use strict'

export function convertColor (hex, format) {
  const { rgbArray } = hexToRgb(hex)

  switch (format) {
    case 'hex':
      return hex
    case 'hexa':
      return `${hex}FF`
    case 'css_rgb':
      return `rgb(${rgbArray.join(', ')})`
    case 'css_rgba':
      return `rgba(${rgbArray.join(', ')}, 1)`
    case 'css_hsl':
      return rgbToHsl(...rgbArray)
    case 'css_hsla':
      return `${rgbToHsl(...rgbArray).slice(0, -1)}, 1)`
    case 'hsb':
      return rgbToHsb(...rgbArray)
    case 'cmyk':
      return rgbToCmyk(...rgbArray)
    default:
      throw new Error('Unsupported format')
  }
}

function hexToRgb (hex) {
  const bigint = parseInt(hex.substring(1), 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return {
    rgbString: `rgb(${r}, ${g}, ${b})`,
    rgbArray: [r, g, b]
  }
}

function rgbToHsl (r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s
  let l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  h = Math.round(h * 360)
  s = Math.round(s * 100)
  l = Math.round(l * 100)

  return `hsl(${h}, ${s}%, ${l}%)`
}

function rgbToHsb (r, g, b) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h
  let s
  let v = max

  const d = max - min
  s = max === 0 ? 0 : d / max

  if (max === min) {
    h = 0 // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  h = Math.round(h * 360)
  s = Math.round(s * 100)
  v = Math.round(v * 100)

  return `hsb(${h}, ${s}%, ${v}%)`
}

function rgbToCmyk (r, g, b) {
  if (r === 0 && g === 0 && b === 0) {
    return 'cmyk(0%, 0%, 0%, 100%)'
  }

  let c = 1 - r / 255
  let m = 1 - g / 255
  let y = 1 - b / 255
  let k = Math.min(c, Math.min(m, y))

  c = (((c - k) / (1 - k)) * 100 + 0.5) | 0
  m = (((m - k) / (1 - k)) * 100 + 0.5) | 0
  y = (((y - k) / (1 - k)) * 100 + 0.5) | 0
  k = (k * 100 + 0.5) | 0

  return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`
}
