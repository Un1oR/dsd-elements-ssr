import { readFile } from 'fs/promises'
import { pathToFileURL } from 'url'
import { parse } from 'acorn'
import fg from 'fast-glob'

export default function dsdElementsSSR(options = {}) {
  const { exclude = [] } = options
  let resolvedRoot
  let renderers = {}

  return {
    name: 'dsd-elements-ssr',
    apply: 'build',
    configResolved(config) {
      resolvedRoot = config.root || process.cwd()
    },
    async buildStart() {
      const root = resolvedRoot || process.cwd()
      const globPattern = `${root}/**/*.js`
      const ignore = Array.isArray(exclude) ? exclude : [exclude]
      const componentFiles = await fg(globPattern, { absolute: true, ignore })
      const descriptors = await Promise.all(componentFiles.map(scanComponent))
      renderers = await loadRenderFunctions(descriptors, this)
    },
    transformIndexHtml(html) {
      if (!Object.keys(renderers).length) return html
      return renderIntoTags(html, renderers, this)
    },
  }
}

async function scanComponent(filePath) {
  const source = await readFile(filePath, 'utf8')
  const ast = parse(source, { ecmaVersion: 'latest', sourceType: 'module' })
  let tagName
  let renderExport
  let className

  walk(ast, (node) => {
    if (node.type === 'CallExpression' && isCustomDefine(node)) {
      const [tagArg, classArg] = node.arguments
      if (tagArg?.type === 'Literal' && typeof tagArg.value === 'string') {
        tagName = tagArg.value
      }
      if (classArg?.type === 'Identifier') {
        className = classArg.name
      }
    }

    if (node.type === 'ExportNamedDeclaration') {
      if (node.declaration) {
        if (
          node.declaration.type === 'FunctionDeclaration' &&
          node.declaration.id?.name?.startsWith('render')
        ) {
          renderExport = node.declaration.id.name
        } else if (node.declaration.type === 'VariableDeclaration') {
          for (const decl of node.declaration.declarations) {
            if (decl.id?.type === 'Identifier' && decl.id.name.startsWith('render')) {
              renderExport = decl.id.name
            }
          }
        }
      } else {
        for (const spec of node.specifiers ?? []) {
          if (spec.exported?.name?.startsWith('render')) {
            renderExport = spec.exported.name
          }
        }
      }
    }
  })

  return { filePath, tagName, renderExport, className }
}

async function loadRenderFunctions(descriptors, pluginCtx) {
  const elements = {}

  for (const descriptor of descriptors) {
    const { filePath, tagName, renderExport, className } = descriptor
    if (!tagName) continue

    const restore = ensureDomStubs()
    try {
      const mod = await import(pathToFileURL(filePath).href)
      let fn

      if (renderExport && typeof mod[renderExport] === 'function') {
        fn = mod[renderExport]
      } else if (className && typeof mod[className]?.render === 'function') {
        fn = mod[className].render.bind(mod[className])
      }

      if (typeof fn === 'function') {
        elements[tagName] = fn
      } else {
        const why = renderExport
          ? `экспорт ${renderExport}`
          : className
            ? `static render у ${className}`
            : 'render-функция'
        pluginCtx?.warn(`dsd-inline: ${why} в ${filePath} не является функцией`)
      }
    } catch (err) {
      pluginCtx?.warn(`dsd-inline: не удалось импортировать ${filePath}: ${err.message}`)
    } finally {
      restore()
    }
  }

  return elements
}

function renderIntoTags(html, renderers, pluginCtx) {
  const tags = Object.keys(renderers)
  if (!tags.length) return html
  const pattern = new RegExp(`<(${tags.join('|')})(\\b[^>]*)>([\\s\\S]*?)</\\1>`, 'gi')

  return html.replace(pattern, (match, tag, attrs = '', inner = '') => {
    const fn = renderers[tag]
    if (typeof fn !== 'function') return match
    const parsedAttrs = parseAttrs(attrs)
    try {
      const rendered = fn(parsedAttrs) ?? ''
      return `<${tag}${attrs}>${rendered}${inner}</${tag}>`
    } catch (err) {
      pluginCtx?.warn(`dsd-inline: render failed for <${tag}>: ${err.message}`)
      return match
    }
  })
}

function ensureDomStubs() {
  const prev = {
    HTMLElement: globalThis.HTMLElement,
    customElements: globalThis.customElements,
  }

  if (typeof globalThis.HTMLElement === 'undefined') {
    globalThis.HTMLElement = class HTMLElement {}
  }
  if (typeof globalThis.customElements === 'undefined') {
    globalThis.customElements = { define() {} }
  }

  return () => {
    if (prev.HTMLElement === undefined) {
      delete globalThis.HTMLElement
    } else {
      globalThis.HTMLElement = prev.HTMLElement
    }
    if (prev.customElements === undefined) {
      delete globalThis.customElements
    } else {
      globalThis.customElements = prev.customElements
    }
  }
}

function parseAttrs(attrStr = '') {
  const attrs = {}
  const re = /([^\s=]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g
  let m
  while ((m = re.exec(attrStr))) {
    const name = m[1]
    const value = m[2] ?? m[3] ?? m[4] ?? ''
    attrs[name] = value
  }
  return attrs
}

function isCustomDefine(node) {
  const callee = node.callee
  return (
    callee?.type === 'MemberExpression' &&
    !callee.computed &&
    callee.object?.type === 'Identifier' &&
    callee.object.name === 'customElements' &&
    callee.property?.type === 'Identifier' &&
    callee.property.name === 'define'
  )
}

function walk(node, visitor) {
  visitor(node)
  for (const key of Object.keys(node)) {
    const child = node[key]
    if (!child) continue
    if (Array.isArray(child)) {
      for (const item of child) {
        if (item && typeof item.type === 'string') {
          walk(item, visitor)
        }
      }
    } else if (child && typeof child.type === 'string') {
      walk(child, visitor)
    }
  }
}

