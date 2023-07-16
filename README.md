# url2png-express
A simple express server to return the URL screenshot captured by chromium

## Dependencies

This app assume [Chromium](https://www.chromium.org/getting-involved/download-chromium) in installed and available in the system path `/usr/bin/chromium`.

## Installation

```bash
git clone https://github.com/hkbu-kennycheng/url2png-express.git
cd url2png-express
npm install
npm start
```

## Usage

Directly passing in the URL as the path parameter without the protocol prefix in `src` attribute of an ``<img>` tag. All URL is assumed to be HTTPS.

```html
<img src="http://localhost:3000/www.google.com" />
```

You could specify the viewport size by passing in the `width` and `height` path parameters.

```html
<img src="http://localhost:3000/<width>/<height>/www.google.com" />
```

You could also specify the viewport size by passing in the `width` path parameter only. The height will be calculated based on 16:9 aspect ratio of the viewport.

```html
<img src="http://localhost:3000/<width>/www.google.com" />
```

Or you could also use our web service at [https://url2png.hkbu.app/](https://url2png.hkbu.app/) to generate the screenshot.