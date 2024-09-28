const CONTAINER_CLASS = "evasive-container"
const IMAGE_WRAPPER_CLASS = "evasive"

// Use the `load` event because it fires after the images
// are fetched and loaded. Otherwise there may be a race condition.
window.addEventListener("load", () => {
  // const containers = getElements(CONTAINER_CLASS)
  const wrappers = getElements(IMAGE_WRAPPER_CLASS)

  // for (let i = 0; i < containers.length; i++) {
  //   const container = containers.item(i)
  //   if (container) {
  //     // Set height and width so containers stay in place
  //     sizeElement(container)
  //   }
  // }

  // Position elements absolutely with current location so
  // that updating the elements' positions later won't shift
  // the layout for other elements that have not been
  // positioned absolutely.
  // for (let i = 0; i < wrappers.length; i++) {
  //   const wrapper = wrappers.item(i)
  //   if (wrapper) {
  //     // First, add `top` and `left positions
  //     positionElement(wrapper)
  //   }
  // }

  // for (let i = 0; i < wrappers.length; i++) {
  //   const wrapper = wrappers.item(i)
  //   if (wrapper) {
  //     // Next, change the position of each element.
  //     // This is done in two steps to minimize layout
  //     // shift that could happen in the timing of iterating
  //     // through elements and adjusting their position.
  //     positionElementAbsolute(wrapper)
  //   }
  // }
})

document.addEventListener("DOMContentLoaded", () => {
  const wrappers = getElements(IMAGE_WRAPPER_CLASS)

  // Add "mouseover" evasion listener to each image
  for (let i = 0; i <= wrappers.length; i++) {
    const wrapper = wrappers.item(i)
    if (wrapper) {
      evadeTheMouse(wrapper)
    }
  }
})

/**
 * Get a list of elements by class name
 * @param {string} className
 * @returns {HTMLCollection}
 */
function getElements(className) {
  const wrappers = document.getElementsByClassName(className)
  if (!wrappers.length) {
    console.warn("No elements found.")
  }

  return wrappers
}

/**
 * Size the element's height and width explicitly
 * based on current height and width
 * @param {HTMLElement} element
 */
function sizeElement(element) {
  const { height, width } = element.getBoundingClientRect()
  element.style.setProperty("height", `${height}px`)
  element.style.setProperty("width", `${width}px`)
}

/**
 * Add `top` and `left` styles to element based on
 * its current position
 * @param {HTMLElement} element
 */
function positionElement(element) {
  const { top, left } = element.getBoundingClientRect()
  const { scrollX, scrollY } = window
  element.style.setProperty("top", `${top + scrollY}px`)
  element.style.setProperty("left", `${left + scrollX}px`)
}

/**
 * Add `position: absolute` style to element
 * @param {HTMLElement} element
 */
function positionElementAbsolute(element) {
  element.style.setProperty("position", "absolute")
}

/**
 * Add a `mouseover` event listener to an element
 * so that the element's position changes and moves
 * away from the mouse every time it hovers over
 * the element
 * @param {HTMLElement} element
 */
function evadeTheMouse(element) {
  if (!element) {
    return
  }

 
  element.addEventListener("mousemove", (e) => {
    // Get the location of the window, element, and mouse
    const { scrollX, scrollY } = window
    const { clientX: mouseX, clientY: mouseY } = e
    const { top, left, right, bottom, height, width } = element.getBoundingClientRect()

    // Exit early if the mouse isn't overlapping
    const mouseIsIntersecting = mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom
    if (!mouseIsIntersecting) {
      return
    }

    // Create vectors for each coordinate to more easily do math operations
    const windowScrollV = new Vector(scrollX ?? 0, scrollY ?? 0)
    const mouseV = new Vector(mouseX, mouseY)
    const centerV = new Vector(left + width / 2, top + height / 2)
    // Calculate where the line from the center to mouse will extend
    // into the edge of the image
    const targetV = getIntersectingPoint({ top, left, right, bottom, height, width }, centerV, mouseV)
    // Calculate how far the mouse is from the edge of the image
    // (where it should be)
    const deltaV = mouseV.subtract(targetV)
    // Move the corner of the image the same amount, plus add
    // the scroll location to the calculated coordinates
    const newTopLeftV = new Vector(left, top).add(deltaV).add(windowScrollV)

    // TODO: Make these not get stuck in the corner!
    if (newTopLeftV.x < 0) {
      newTopLeftV.x = 0;
    }
    if (newTopLeftV.y < 0) {
      newTopLeftV.y = 0;
    }

    // Set the new element's position
    element.style.setProperty("position", "absolute")
    element.style.setProperty("top", `${newTopLeftV.y}px`)
    element.style.setProperty("left", `${newTopLeftV.x}px`)
  })
}

/**
 * Append a shape to the body with a specific position
 * and dimensions. Optionally customize color and radius.
 * @param {number} top
 * @param {number} left
 * @param {number} height
 * @param {number} width
 * @param {string} [color="red"]
 * @param {number} [radius]
 */
function createDebugShape(top, left, height, width, color = "red", radius) {
  const div = document.createElement("div")
  div.style.setProperty("background-color", color)
  div.style.setProperty("position", "absolute")
  div.style.setProperty("top", `${top}px`)
  div.style.setProperty("left", `${left}px`)
  div.style.setProperty("height", `${height}px`)
  div.style.setProperty("width", `${width}px`)
  if (radius) {
    div.style.setProperty("border-radius", radius)
    div.style.setProperty("border", "1px solid black")
  }
  document.body.appendChild(div)
}

/**
 * A vector with (`x`, `y`) coordinates and methods for
 * basic vector math operations
 */
class Vector {
  /**
   * Create a vector
   * @param {number} x The x coordinate
   * @param {number} y The y coordinate
   */
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  /**
   * @param {Vector} v2
   */
  add(v2) {
    return new Vector(this.x + v2.x, this.y + v2.y)
  }

  /**
   * @param {Vector} v2
   */
  subtract(v2) {
    return new Vector(this.x - v2.x, this.y - v2.y)
  }

  /**
   * @param {number} factor A number to multiply the vector by
   */
  multiply(factor) {
    return new Vector(this.x * factor, this.y * factor)
  }

   /**
   * @param {number} factor A number to divide the vector by
   */
  divide(factor) {
    return new Vector(this.x / factor, this.y / factor)
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  normalize() {
    return this.divide(this.length())
  }
}

/**
 * Find the point where the vector from the center of the HMTL element
 * to the mouse will intersect with the edge of the HTML element
 * @param {HTMLElement} element The HTML element
 * @param {Vector} center A vector representing the element's center coordinates
 * @param {Vector} mouse A vector representing the mouse coordinates
 * @param {boolean} [debug=false] Option to draw shapes to help with debugging
 * @returns {Vector} The vector of the intersection
 */
function getIntersectingPoint(element, center, mouse, debug = false) {
  const edges = findNearestEdges(element, center, mouse)

  // Calculate the intersecting point for the two closest edges.
  // One edge will have an intersecting point on the edge of the element.
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i]
    const slope = getSlope(center, mouse)
    if (debug) {
      createDebugShape(center.y, center.x, 5, 5, "blue", 2)
    }
    const { solveForX, solveForY } = getEquations(slope, mouse)
    if (edge.x === undefined) {
      const { y } = edge
      const x = solveForX(y)
      if (x <= element.right && x >= element.left) {
        if (debug) {
          createDebugShape(y, x, 3, 3, "green", 2)
        }
        return new Vector(x, y)
      }
    } else if (edge.y === undefined) {
      const { x } = edge
      const y = solveForY(x)
      if (y <= element.bottom && y >= element.top) {
        if (debug) {
          createDebugShape(y, x, 3, 3, "yellow", 2)
        }
        return new Vector(x, y)
      }
    } else {
      throw new Error("Unable to find intersecting point")
    }
  }
}

/**
 * @typedef {object} Edge
 * @property {number|undefined} x
 * @property {number|undefined} y
 */

/**
 * Find the two edges of an HTML element that are closest
 * to the mouse hovering over it
 * @param {HTMLElement} element The HTML element
 * @param {Vector} center A vector representing the element's center coordinates
 * @param {Vector} mouse A vector representing the mouse coordinates
 * @returns {Edge[]} An array of the two closest edges with either an `x` or `y` value
 */
function findNearestEdges(element, center, mouse) {
  const edges = []
  if (mouse.x <= center.x) {
    // Mouse is on the left
    edges.push({ x: element.left, y: undefined })
  } else {
    // Mouse is on the right
    edges.push({ x: element.right, y: undefined })
  }
  
  if (mouse.y <= center.y) {
    // Mouse is on the top
    edges.push({ x: undefined, y: element.top })
  } else {
    // Mouse is on the bottom
    edges.push({ x: undefined, y: element.bottom })
  }

  return edges
}

/**
 * Calculate the slope of the line between two vectors
 * @param {Vector} point1
 * @param {Vector} point2
 * @returns {number}
 */
function getSlope(point1, point2) {
	return (point2.y - point1.y) / (point2.x - point1.x)
}

/**
 * Returns two functions that calculate coordinates
 * on the same line, given either an `x` coordinate
 * or a `y` coordinate
 * @param {number} slope The slope of a line
 * @param {Vector} point A known point on the line
 */

function getEquations(slope, point) {
  /**
   * @param {number} x The `x` coordinate on the line
   * @returns {number} The `y` coordinate on the line
   */
	function solveForY(x) {
  	return slope * x - slope * point.x + point.y
  }

  /**
   * @param {number} y The `y` coordinate on the line
   * @returns {number} The `x` coordinate on the line
   */
  function solveForX(y) {
  	return (y - point.y + slope * point.x) / slope
  }
  
  return { solveForX, solveForY }
}
