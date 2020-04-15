import { walk } from '../utils'

export function handleHtmlDirective(element, content) {
    const sandbox = document.createElement('div')
    sandbox.innerHTML = content
    walk(sandbox, el => {
        const tagname = el.tagName.toLowerCase()
        // we remove script, styles and link tag because they could affect the global state of the page
        if (tagname === 'script' || tagname === 'styles'  || tagname === 'link') {
            el.parentNode.removeChild(el)
        }
        // we remove active attributes (alpine or on* attributes) since they are dangerous
        // and potentially they can lead to XSS vulnerabilities
        const regexp = /^(x-|on)\b/
        Array.from(el.attributes).forEach(attribute => {
            if (attribute.name.match(regexp)) {
                el.removeAttribute(attribute.name)
            }
        })
    })
    element.innerHTML = sandbox.innerHTML
}
