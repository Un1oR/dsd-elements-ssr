import { DSDElement } from './dsd-element.js'

export class SiteHeader extends DSDElement {
  connectedCallback() {
    this.renderDSD()
    this._attachListeners()
  }

  static render(attrs = {}) {
    const title = attrs.title ?? 'Мой сайт'
    return `<template shadowrootmode="open">
  <style>
    header {
      padding: 1rem;
      border-bottom: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: system-ui, sans-serif;
    }
    nav a {
      margin-left: 1rem;
      text-decoration: none;
      color: inherit;
    }
  </style>
  <header>
    <div class="logo"><slot name="logo">${title}</slot></div>
    <nav><slot name="nav"></slot></nav>
  </header>
</template>`
  }

  _attachListeners() {
    if (this._listenersAttached) return
    this._listenersAttached = true

    const navItems = Array.from(this.querySelectorAll('a'))
    navItems.forEach((a) => {
      a.addEventListener('pointerenter', () => {
        a.style.color = 'tomato'
      })
      a.addEventListener('pointerleave', () => {
        a.style.color = ''
      })
    })
  }
}
customElements.define('site-header', SiteHeader)
