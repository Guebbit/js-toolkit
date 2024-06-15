/**
 * TODO REDO
 * CREATED WITH CHATGPT
 */
import { eventDelegate } from '../src';

describe('eventDelegate', () => {
  let parent: HTMLElement;
  let child: HTMLElement;
  let callback: jest.Mock;
  let mouseEvent: MouseEvent;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="parent">
        <div id="child"></div>
      </div>
    `;

    parent = document.body; // document.getElementById('parent') as HTMLElement;
    child = document.getElementById('child') as HTMLElement;
    callback = jest.fn();
    // Simulate click event
    mouseEvent = new MouseEvent('click', { bubbles: true });
  });

  test('should add event listener to parent and trigger callback when child is clicked', () => {
    eventDelegate('click', '#child', callback, parent);

    child.dispatchEvent(mouseEvent);

    expect(callback).toHaveBeenCalled();
    expect(callback.mock.instances[0]).toBe(child);
  });

  test('should not trigger callback when clicking outside child', () => {
    eventDelegate('click', '#child', callback, parent);
    parent.dispatchEvent(mouseEvent);

    expect(callback).not.toHaveBeenCalled();
  });

  test('should add event listener to window and trigger callback when child is clicked', () => {
    eventDelegate('click', '#child', callback);
    child.dispatchEvent(mouseEvent);

    expect(callback).toHaveBeenCalled();
    expect(callback.mock.instances[0]).toBe(child);
  });

  test('should not trigger callback if childSelector is not matched', () => {
    eventDelegate('click', '#nonexistent', callback, parent);
    child.dispatchEvent(mouseEvent);

    expect(callback).not.toHaveBeenCalled();
  });

  test('should trigger callback if childSelector is a Node containing the clicked element', () => {
    eventDelegate('click', parent, callback);
    child.dispatchEvent(mouseEvent);

    expect(callback).toHaveBeenCalled();
    expect(callback.mock.instances[0]).toBe(child);
  });
});
