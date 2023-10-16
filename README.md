# ImgSeq

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

#### Demo

##### twgl.js (default)

[https://mizt.github.io/ImgSeq/](https://mizt.github.io/ImgSeq/)

##### three.js

[https://mizt.github.io/ImgSeq/three/](https://mizt.github.io/ImgSeq/three/)
