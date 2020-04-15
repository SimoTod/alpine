import { walk } from '../utils'

export function handleHtmlDirective(element, content) {
    const sandbox = document.createElement('div')
    sandbox.innerHTML = content
    walk(sandbox, el => {
        // we remove x-* attributes since they would selfevaluate
        // and they can potentially lead to XSS vulnerabilities
        const regexp = /^(x-)\b/
        Array.from(el.attributes).forEach(attribute => {
            if (attribute.name.match(regexp)) {
                el.removeAttribute(attribute.name)
            }
        })
    })
    element.innerHTML = sandbox.innerHTML
}
