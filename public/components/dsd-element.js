// Базовый элемент, который поднимает DSD в shadow при первом подключении
export class DSDElement extends HTMLElement {
  renderDSD({ update = false } = {}) {
    const renderer = this.constructor.render
    if (typeof renderer !== 'function') return this.shadowRoot

    this.querySelectorAll('template').forEach((tpl) => tpl.remove())

    const tpl = Document.parseHTMLUnsafe(renderer(collectAttrs(this))).querySelector('template')
    if (!tpl) return this.shadowRoot

    const shadowExisted = Boolean(this.shadowRoot)
    const shadow =
      this.shadowRoot ||
      this.attachShadow({
        mode: tpl.getAttribute('shadowrootmode') || tpl.getAttribute('shadowroot') || 'open',
        delegatesFocus: tpl.hasAttribute('shadowrootdelegatesfocus'),
      })

    if (!update && shadowExisted) return shadow

    shadow.innerHTML = ''
    shadow.appendChild(tpl.content.cloneNode(true))
    return shadow
  }
}

function collectAttrs(host) {
  return Object.fromEntries(Array.from(host.attributes, ({ name, value }) => [name, value]))
}
