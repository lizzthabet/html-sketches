# doors-to-doors

this sketch is forked from [my glitch project of the same name](https://preview.glitch.com/project/doors-to-doors), which itself was built from the [trickster server](../trickster-server/README.md) first prototyped in the bowels of these html sketches. the site is served from a trickster static web server that, instead of faithfully returning each request for a resource, will choose a random resource of the same type to respond with.
## local dev

```bash
npm install && npm run dev
```

## deployment

for now, this site is automatically deployed on commits to the `main` branch using render, which supports full stack web applications.
