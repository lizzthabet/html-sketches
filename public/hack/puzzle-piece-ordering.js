const queue = ["24", "20", "3", "21", "16", "23", "6", "5", "25", "10", "11", "17", "9", "12", "19", "14", "13", "15", "1", "4", "2", "8", "7", "22", "18", "26"]
const ideal = {
  "1": {
    "current": "1",
    "next": "2",
    "target": {
      "x": 469,
      "y": 339
    }
  },
  "2": {
    "current": "2",
    "next": "3",
    "target": {
      "x": 469,
      "y": 230
    }
  },
  "3": {
    "current": "3",
    "next": "4",
    "target": {
      "x": 455,
      "y": 290
    }
  },
  "4": {
    "current": "4",
    "next": "5",
    "target": {
      "x": 445,
      "y": 152
    }
  },
  "5": {
    "current": "5",
    "next": "6",
    "target": {
      "x": 331,
      "y": 183
    }
  },
  "6": {
    "current": "6",
    "next": "7",
    "target": {
      "x": 405,
      "y": 166
    }
  },
  "7": {
    "current": "7",
    "next": "8",
    "target": {
      "x": 455,
      "y": 163
    }
  },
  "8": {
    "current": "8",
    "next": "9",
    "target": {
      "x": 469,
      "y": 116
    }
  },
  "9": {
    "current": "9",
    "next": "10",
    "target": {
      "x": 277,
      "y": 166
    }
  },
  "10": {
    "current": "10",
    "next": "11",
    "target": {
      "x": 241,
      "y": 145
    }
  },
  "11": {
    "current": "11",
    "next": "12",
    "target": {
      "x": 235,
      "y": 163
    }
  },
  "12": {
    "current": "12",
    "next": "13",
    "target": {
      "x": 406,
      "y": 404
    }
  },
  "13": {
    "current": "13",
    "next": "14",
    "target": {
      "x": 328,
      "y": 418
    }
  },
  "14": {
    "current": "14",
    "next": "15",
    "target": {
      "x": 301,
      "y": 403
    }
  },
  "15": {
    "current": "15",
    "next": "16",
    "target": {
      "x": 243,
      "y": 340
    }
  },
  "16": {
    "current": "16",
    "next": "17",
    "target": {
      "x": 229,
      "y": 290
    }
  },
  "17": {
    "current": "17",
    "next": "18",
    "target": {
      "x": 228,
      "y": 212
    }
  },
  "18": {
    "current": "18",
    "next": "19",
    "target": {
      "x": 392,
      "y": 354
    }
  },
  "19": {
    "current": "19",
    "next": "20",
    "target": {
      "x": 266,
      "y": 354
    }
  },
  "20": {
    "current": "20",
    "next": "21",
    "target": {
      "x": 342,
      "y": 340
    }
  },
  "21": {
    "current": "21",
    "next": "22",
    "target": {
      "x": 264,
      "y": 226
    }
  },
  "22": {
    "current": "22",
    "next": "23",
    "target": {
      "x": 342,
      "y": 212
    }
  },
  "23": {
    "current": "23",
    "next": "24",
    "target": {
      "x": 391,
      "y": 226
    }
  },
  "24": {
    "current": "24",
    "next": "25",
    "target": {
      "x": 279,
      "y": 276
    }
  },
  "25": {
    "current": "25",
    "next": "26",
    "target": {
      "x": 406,
      "y": 276
    }
  },
  "26": {
    "current": "26",
    "next": "",
    "target": {
      "x": 328,
      "y": 290
    }
  }
}

const current = {
  "1": {
    "target": { "x": 468, "y": 339 },
    "initial": { "x": "INITIAL_X_MAX", "y": 339 },
    "direction": "left"
  },
  "2": {
    "target": { "x": 469, "y": 230 },
    "initial": { "x": "INITIAL_X_MAX", "y": 230 },
    "direction": "left"
  },
  "3": {
    "target": { "x": 455, "y": 290 },
    "initial": { "x": "INITIAL_X_MIN", "y": 290 },
    "direction": "right"
  },
  "4": {
    "target": { "x": 445, "y": 152 },
    "initial": { "x": "INITIAL_X_MIN", "y": 152 },
    "direction": "right"
  },
  "5": {
    "target": { "x": 332, "y": 183 },
    "initial": { "x": "INITIAL_X_MIN", "y": 183 },
    "direction": "right"
  },
  "6": {
    "target": { "x": 405, "y": 166 },
    "initial": { "x": "INITIAL_X_MAX", "y": 166 },
    "direction": "left"
  },
  "7": {
    "target": { "x": 454, "y": 164 },
    "initial": { "x": "INITIAL_X_MAX", "y": 164 },
    "direction": "left"
  },
  "8": {
    "target": { "x": 469, "y": 116 },
    "initial": { "x": "INITIAL_X_MIN", "y": 116 },
    "direction": "right"
  },
  "9": {
    "target": { "x": 277, "y": 166 },
    "initial": { "x": "INITIAL_X_MAX", "y": 166 },
    "direction": "left"
  },
  "10": {
    "target": { "x": 241, "y": 145 },
    "initial": { "x": "INITIAL_X_MAX", "y": 145 },
    "direction": "left"
  },
  "11": {
    "target": { "x": 235, "y": 163 },
    "initial": { "x": "INITIAL_X_MIN", "y": 163 },
    "direction": "right"
  },
  "12": {
    "target": { "x": 405, "y": 403 },
    "initial": { "x": "INITIAL_X_MAX", "y": 403 },
    "direction": "left"
  },
  "13": {
    "target": { "x": 328, "y": 418 },
    "initial": { "x": "INITIAL_X_MAX", "y": 418 },
    "direction": "left"
  },
  "14": {
    "target": { "x": 301, "y": 403 },
    "initial": { "x": "INITIAL_X_MIN", "y": 403 },
    "direction": "right"
  },
  "15": {
    "target": { "x": 243, "y": 340 },
    "initial": { "x": "INITIAL_X_MIN", "y": 340 },
    "direction": "right"
  },
  "16": {
    "target": { "x": 229, "y": 290 },
    "initial": { "x": "INITIAL_X_MAX", "y": 290 },
    "direction": "left"
  },
  "17": {
    "target": { "x": 228, "y": 212 },
    "initial": { "x": "INITIAL_X_MIN", "y": 212 },
    "direction": "right"
  },
  "18": {
    "target": { "x": 392, "y": 353 },
    "initial": { "x": "INITIAL_X_MAX", "y": 353 },
    "direction": "left"
  },
  "19": {
    "target": { "x": 266, "y": 354 },
    "initial": { "x": "INITIAL_X_MIN", "y": 353 },
    "direction": "right"
  },
  "20": {
    "target": { "x": 341, "y": 339 },
    "initial": { "x": "INITIAL_X_MAX", "y": 339 },
    "direction": "left"
  },
  "21": {
    "target": { "x": 264, "y": 226 },
    "initial": { "x": "INITIAL_X_MAX", "y": 226 },
    "direction": "left"
  },
  "22": {
    "target": { "x": 342, "y": 212 },
    "initial": { "x": "INITIAL_X_MIN", "y": 212 },
    "direction": "right"
  },
  "23": {
    "target": { "x": 392, "y": 227 },
    "initial": { "x": "INITIAL_X_MIN", "y": 227 },
    "direction": "right"
  },
  "24": {
    "target": { "x": 279, "y": 276 },
    "initial": { "x": "INITIAL_X_MAX", "y": 276 },
    "direction": "left"
  },
  "25": {
    "target": { "x": 406, "y": 276 },
    "initial": { "x": "INITIAL_X_MIN", "y": 276 },
    "direction": "right"
  },
  "26": {
    "target": { "x": 328, "y": 290 },
    "initial": { "x": "INITIAL_X_MAX", "y": 290 },
    "direction": "left"
  }
}

function main() {
  // To get all the pieces in the queue order and merge any updated positions together
  let updated = `{`

  for (const item of queue) {
    const { target } = ideal[item]
    if (!target) {
      console.warn("no ideal target for", item)
      continue
    }
    const c = current[item]
    if (!c) {
      console.warn("no current data for", item)
      continue
    }
    updated += `
    "${item}": {
      "target": ${JSON.stringify(target)},
      "initial": ${JSON.stringify(c.initial)},
      "direction": "${c.direction}"
    },`
  }

  updated += `\n}`

  console.log(updated)
}

main()

window.addEventListener("load", () => {
  // const pieces = {}
  // for (let i = 1; i < 27; i++) {
  //   const piece = document.getElementById(`${i}`)
  //   if (piece) {
  //     const position = {
  //       current: `${i}`,
  //       next: `${i < 26 ? i + 1 : ""}`,
  //       target: {
  //         x: Math.round(parseInt(piece.style["left"].replace(/px$/))),
  //         y: Math.round(parseInt(piece.style["top"].replace(/px$/))),
  //       },
  //       initial: undefined,
  //       direction: undefined,
  //     }
  //     pieces[`${i}`] = position
  //   } else {
  //     console.warn("missing for", i)
  //   }
  // }
  // console.log("PIECES", JSON.stringify(pieces))
  // ---> this might be needed to set the size of containers where their content is positioned absolutely
  // const verification = document.getElementById("verification")
  // if (verification) {
  //   const { height, width } = verification.getBoundingClientRect()
  //   verification.style.setProperty("width", width + "px")
  //   verification.style.setProperty("height", height + "px")
  // }

  // Batch reposition a set of elements in relation to a parent element
  // setTimeout(() => {
  //   const wrapper = document.getElementById("verification-two")
  //   if (wrapper) {
  //     const { top } = wrapper.getBoundingClientRect()
  //     const draggables = document.querySelectorAll("#puzzles-two > [data-draggable]")
  //     draggables.forEach((d) => {
  //       const { top: currentTop } = d.getBoundingClientRect()
  //       console.log(top, currentTop)
  //       d.style.setProperty("top", currentTop - top + "px")
  //     })
  //   }
  // }, 1000)
})