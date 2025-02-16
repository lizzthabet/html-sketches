/**
 * 
 * @param {MouseEvent} event
 */
function moveOnMouseDown(event) {
  // Use the currentTarget for calculating position, because it's the
  // element that has the "data-draggable" property on it. The target
  // may be another element inside of it.
  // The offset properties calculate the difference between
  // the mouse down coordinates and the target element, so the
  // element stays in the same position relative to the mouse
  // as it moves.
  const { currentTarget, offsetX, offsetY } = event

  /**
   * 
   * @param {MouseEvent} event 
   */
  function onMouseMove(event) {
    // Add the scroll position from the window since move event coordinates
    // are based on the viewport
    const { scrollX, scrollY } = window
    const {
      offsetX: targetOffsetFromViewportX,
      offsetY: targetOffsetFromViewportY
    } = getStyleAndPositionDiff(currentTarget)

    // Use the mouse position from the move event to set the target's position
    const newLeft = event.clientX - offsetX + scrollX + targetOffsetFromViewportX + "px"
    const newTop = event.clientY - offsetY + scrollY + targetOffsetFromViewportY + "px"
    currentTarget.style.setProperty("left", newLeft)
    currentTarget.style.setProperty("top", newTop)

    // Debugging
    // console.log(`newLeft = ${event.mouseX} - ${shiftX} + ${scrollX}`)
    // console.log(`newTop = ${event.mouseY} - ${shiftY} + ${scrollY}`)
    // console.log(`mouse is (${event.clientX}, ${event.clientY})`)
    // console.log(`moving from (${leftNow}, ${topNow}) => (${newLeft}, ${newTop})` )
  }

  function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove)
    document.removeEventListener("mouseup", onMouseUp)
  }

  document.addEventListener("mousemove", onMouseMove)
  document.addEventListener("mouseup", onMouseUp)
}

/**
 * Returns the offset coordinates for an element.
 * If an element is positioned absolutely inside
 * a parent element that has a non-static position,
 * then the CSS position will be relative to the parent.
 * @param {HTMLElement} element 
 */
function getStyleAndPositionDiff(element) {
  // Note: there may be a better way to calculate this, but
  // this will work for now. It does rely on position
  // already being set.
  const offsetInPx = { offsetX: 0, offsetY: 0 }

  const styleTopString = element.style.getPropertyValue("top") // do i need to worry about units?
  const styleLeftString = element.style.getPropertyValue("left")

  if (styleTopString === "" && styleLeftString === "") {
    return offsetInPx
  }

  const { top: viewportTop, left: viewportLeft } = element.getBoundingClientRect()
  const { scrollX, scrollY } = window
  const actualLeft = viewportLeft + scrollX
  const actualTop = viewportTop + scrollY
  if (styleLeftString) {
    try {
      const styleLeftStringInt = styleLeftString.replace(/px$/) // might be more performant to just trim last two string values?
      const styleLeft = parseInt(styleLeftStringInt)
      offsetInPx.offsetX = styleLeft - actualLeft
      // console.log(`actual left ${actualLeft} vs style left ${styleLeft}, with scroll ${scrollX}`)
    } catch (err) {
      console.warn("failed to parse element style", err)
    }
  }

  if (styleTopString) {
    try {
      const styleTopStringInt = styleTopString.replace(/px$/)
      const styleTop = parseInt(styleTopStringInt)
      offsetInPx.offsetY = styleTop - actualTop
      // console.log(`actual top ${actualTop} vs style left ${styleTop}, with scroll ${scrollY}`)
    } catch (err) {
      console.warn("failed to parse element style", err)
    }
  }

  // console.log(`offset from parent values: (${offsetInPx.offsetX}, ${offsetInPx.offsetY})`)
  return offsetInPx
}

function getCurrentPosition(element) {
  const { top, left } = element.getBoundingClientRect()
  const { scrollX, scrollY } = window
  return { top: top + scrollY, left: left + scrollX }
}

function getEnvConfig() {
  try {
    return ENVIRONMENT_CONFIG
  } catch (_err) {
    return {}
  }
}

// Use the `load` event because it fires after the images
// are fetched and loaded. Otherwise there may be a race condition.
window.addEventListener("load", () => {
  const draggable = document.querySelectorAll("[data-draggable]")
  const config = getEnvConfig()
  if (config.setInitialPosition === true) {
    // Set the position of each element before absoluting them,
    // so that there are no layout shifts
    draggable.forEach((ele) => {
      const { top, left } = getCurrentPosition(ele)
      ele.style.setProperty("top", top + "px")
      ele.style.setProperty("left", left + "px")
    })
  }

  draggable.forEach((ele) => {
    ele.setAttribute("draggable", false)
    ele.style.setProperty("position", "absolute")
    ele.addEventListener("mousedown", moveOnMouseDown)
  })
})