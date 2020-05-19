import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('$nextTick', async () => {
    document.body.innerHTML = `
        <div x-data="{foo: 'bar'}">
            <span x-text="foo" x-ref="span"></span>

            <button x-on:click="foo = 'baz'; $nextTick(() => {$refs.span.innerText = 'bob'})"></button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('bar')

    document.querySelector('button').click()

    await wait(() => expect(document.querySelector('span').innerText).toEqual('bob'))
})

test('nextTick wait for x-for to finish rendering', async () => {
    document.body.innerHTML = `
        <div x-data="{list: ['one', 'two'], check: 2}">
            <template x-for="item in list">
                <span x-text="item"></span>
            </template>

            <p x-text="check"></p>

            <button x-on:click="list = ['one', 'two', 'three']; $nextTick(() => {check = document.querySelectorAll('span').length})"></button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('p').innerText).toEqual(2)

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('p').innerText).toEqual(3) })
})

test('$nextTick works with transitions', async () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        setTimeout(callback, 0)
    });

    document.body.innerHTML = `
        <div x-data="{show: false, foo: '---'}">
            <div x-show="show"></div> <!-- we need to make sure the stack is not emptied by the first x-show directive -->
            <div id="A"
                x-show="show"
                x-transition:enter="enter"
                x-transition:enter-start="enter-start"
                x-transition:enter-end="enter-end">
            </div>

            <span x-text="foo"></span>

            <button x-on:click="show = true; $nextTick(() => {foo = document.querySelector('#A').getAttribute('style')})"></button>
        </div>
    `

    Alpine.start()

    await wait(() => expect(document.querySelector('#A').getAttribute('style')).toEqual('display: none;'))

    document.querySelector('button').click()

    await wait(() => expect(document.querySelector('#A').getAttribute('style')).toEqual(null))

    // NextTick should run after we show the element so the style property should be null
    // We stash them in a variable so we can test it without worring about timing issues
    expect(document.querySelector('span').innerText).toEqual(null)
})
