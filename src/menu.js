'use strict'

export const menuItems = [
  {
    title: 'Color Format',
    id: 'color_format',
    contexts: ['action'],
    type: 'normal'
  },
  {
    title: 'HEX',
    id: 'hex',
    contexts: ['action'],
    type: 'radio',
    parentId: 'color_format'
  },
  {
    title: 'HEXA',
    id: 'hexa',
    contexts: ['action'],
    type: 'radio',
    parentId: 'color_format'
  },
  {
    title: 'CSS RGB',
    id: 'css_rgb',
    contexts: ['action'],
    type: 'radio',
    parentId: 'color_format'
  },
  {
    title: 'CSS RGBA',
    id: 'css_rgba',
    contexts: ['action'],
    type: 'radio',
    parentId: 'color_format'
  },
  {
    title: 'CSS HSL',
    id: 'css_hsl',
    contexts: ['action'],
    type: 'radio',
    parentId: 'color_format'
  },
  {
    title: 'CSS HSLA',
    id: 'css_hsla',
    contexts: ['action'],
    type: 'radio',
    parentId: 'color_format'
  },
  {
    title: 'HSB',
    id: 'hsb',
    contexts: ['action'],
    type: 'radio',
    parentId: 'color_format'
  },
  {
    title: 'CMYK',
    id: 'cmyk',
    contexts: ['action'],
    type: 'radio',
    parentId: 'color_format'
  }
]
