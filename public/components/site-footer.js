import { DSDElement } from './dsd-element.js'

export class SiteFooter extends DSDElement {
  connectedCallback() {
    this.renderDSD()
    this._attachListeners()
  }

  static get observedAttributes() {
    return ['title']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.renderDSD({ update: true })
  }

  static render(attrs = {}) {
    const text = attrs.title ?? 'Дефолтный тайтл'
    return `<template shadowrootmode="open">
  <style>
    footer {
      padding: 1rem;
      border-top: 1px solid #ccc;
      font-family: system-ui, sans-serif;
      text-align: center;
      color: #444;
    }
  </style>
  <footer>
    <slot>${text}</slot>
  </footer>
</template>`
  }

  _onClick = () => {
    const current = this.getAttribute('title') ?? ''
    const reversed = [...current].reverse().join('')
    if (reversed !== current) {
      this.setAttribute('title', reversed)
    }
  }

  _attachListeners() {
    if (this._listenersAttached) return
    this._listenersAttached = true
    this.addEventListener('click', this._onClick)
  }
}

customElements.define('site-footer', SiteFooter)
