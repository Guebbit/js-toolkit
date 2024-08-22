/**
 * Get center of HTML element
 *
 * @param element
 */
export default (element: Element) => {
  const rect = element.getBoundingClientRect();
  return [
    rect.left + rect.width / 2,
    rect.top + rect.height / 2
  ]
}
