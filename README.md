# html sketches
☁  ☁  ☁  ☁  ☁  ☁  ☁  ☁  ☁

a messy space for sketching w html, css, js

(\*・‿・)ノ⌒\*:･ﾟ✧

## local dev
```sh
npm run dev
```

this code bucket uses a simple http server, websockets, and nodemon to automatically reload files whenever they're changed, so there's a quick feedback loop when writing code locally. this approach is borrowed generously from [adam coster](https://dev.to/adamcoster/create-a-live-reload-server-for-front-end-development-3gnp). :)

## structure

loosely, this sketchbook is divided into two pieces:
  * `public` directory includes sketches that can be served statically (without the need for a separate backend); these are published online at [sketches.lizz.website](https://sketches.lizz.website)
  * `servers` directory includes sketches that include code that runs outside of the browser; these are (sometimes? always? whenever i feel like it?) deployed as separate sites on render and their links are published at the same site above
