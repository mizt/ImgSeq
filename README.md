# ImgSeq.js

Recording JPG/PNG image sequence in a Quicktime container.

#### Browser Support

[https://developer.mozilla.org/en-US/docs/Web/API/Window/showSaveFilePicker#browser_compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Window/showSaveFilePicker#browser_compatibility)

Using [libjpeg-turbo](https://github.com/libjpeg-turbo/libjpeg-turbo) via Emscripten.

```
Module.cwrap("encodeJPG","number",["number","number","number","number","number"])
```

Using [fpng](https://github.com/richgel999/fpng) via Emscripten.

```
Module.cwrap("encodePNG","number",["number","number","number","number","number"])
```

#### Demo (default)

[https://mizt.github.io/ImgSeq/](https://mizt.github.io/ImgSeq/)