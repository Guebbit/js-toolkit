import { eventDelegate } from '../src'

describe('eventDelegate', () => {
    let parent: HTMLElement
    let child: HTMLElement
    let callback: jest.Mock
    let mouseEvent: MouseEvent

    beforeEach(() => {
        document.body.innerHTML = `
      <div id="parent">
        <div id="child"></div>
      </div>
    `

        parent = document.body // document.getElementById('parent') as HTMLElement;
        child = document.querySelector('#child')!
        callback = jest.fn()
        // Simulate click event
        mouseEvent = new MouseEvent('click', { bubbles: true })
    })

    test('should add event listener to parent and trigger callback when child is clicked', () => {
        eventDelegate('click', '#child', callback, parent)

        child.dispatchEvent(mouseEvent)

        expect(callback).toHaveBeenCalled()
        expect(callback.mock.instances[0]).toBe(child)
    })

    test('should not trigger callback when clicking outside child', () => {
        eventDelegate('click', '#child', callback, parent)
        parent.dispatchEvent(mouseEvent)

        expect(callback).not.toHaveBeenCalled()
    })

    test('should add event listener to window and trigger callback when child is clicked', () => {
        eventDelegate('click', '#child', callback)
        child.dispatchEvent(mouseEvent)

        expect(callback).toHaveBeenCalled()
        expect(callback.mock.instances[0]).toBe(child)
    })

    test('should not trigger callback if childSelector is not matched', () => {
        eventDelegate('click', '#nonexistent', callback, parent)
        child.dispatchEvent(mouseEvent)

        expect(callback).not.toHaveBeenCalled()
    })

    test('should trigger callback if childSelector is a Node containing the clicked element', () => {
        eventDelegate('click', parent, callback)
        child.dispatchEvent(mouseEvent)

        expect(callback).toHaveBeenCalled()
        expect(callback.mock.instances[0]).toBe(child)
    })

    // The Node form asks "is the clicked element inside this node". A sibling
    // branch is not, so the callback must stay silent — without the containment
    // check every click in the document would fire it.
    test('should not trigger callback when the Node selector does not contain the clicked element', () => {
        document.body.innerHTML = '<div id="inside"></div><div id="outside"></div>'
        const inside = document.querySelector('#inside')!
        const outside = document.querySelector('#outside')!

        eventDelegate('click', inside, callback, document.body)
        outside.dispatchEvent(new MouseEvent('click', { bubbles: true }))

        expect(callback).not.toHaveBeenCalled()
    })

    // A Node contains itself, so clicking the delegate target itself counts.
    test('should trigger callback when the Node selector is the clicked element', () => {
        document.body.innerHTML = '<div id="self"></div>'
        const self = document.querySelector('#self')!

        eventDelegate('click', self, callback, document.body)
        self.dispatchEvent(new MouseEvent('click', { bubbles: true }))

        expect(callback).toHaveBeenCalledTimes(1)
    })
})
