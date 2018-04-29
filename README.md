<div align="center">

# web-extension-github-travis-status

**Web Extension enhancing the Travis CI status on GitHub pull request pages.**

[![npm version](https://img.shields.io/npm/v/web-extension-github-travis-status.svg?maxAge=3600&style=flat)](https://www.npmjs.com/package/web-extension-github-travis-status)
[![dependency status](https://img.shields.io/david/dominique-mueller/web-extension-github-travis-status.svg?maxAge=3600&style=flat)](https://david-dm.org/dominique-mueller/web-extension-github-travis-status)
[![travis ci build status](https://img.shields.io/travis/dominique-mueller/web-extension-github-travis-status/master.svg?maxAge=3600&style=flat)](https://travis-ci.org/dominique-mueller/web-extension-github-travis-status)
[![license](https://img.shields.io/npm/l/web-extension-github-travis-status.svg?maxAge=3600&style=flat)](https://github.com/dominique-mueller/web-extension-github-travis-status/LICENSE)

</div>

<br><br>

## What it does

While the integration between **[GitHub](https://github.com/)** and **[Travis CI](https://travis-ci.org/)** works like a charm, it only
provides minimal build information on Pull Request pages. In order to see further build information, developers always have to jump into
the Travis CI web application.

The "GitHub & Travis CI: Enhance Status" web extension, once installed, enhances the build status by also showing the build jobs in the UI,
including the real-time status and runtime. Plus, it provides a link for directly jumping into a build job log in Travis CI.

![Github & Travis CI Enhance Status Preview](/assets/screenshot-01.png?raw=true)

<br><br><br>

## How to install

TODO: Link to Chrome Web Store

<br><br><br>

## Development details

### Running locally

1. Clone the repository:

```
git clone https://github.com/dominique-mueller/web-extension-github-travis-status.git
```

2. Install all dependencies:

```
npm install
```

3. Create production build:

```
npm run build
```

### Toolchain

- The project uses TypeScript, plus the `@types/chrome` typings package
- Webpack is used to create the production bundle, change the `manfiest.json` file and copy assets
- The icon, promotion images and screenshots are created using Adobe After Effects, plus a Chrome Browser Mockup PSD file

<br><br><br>

## Creator

**Dominique Müller**

- E-Mail: **[dominique.m.mueller@gmail.com](mailto:dominique.m.mueller@gmail.com)**
- Website: **[www.devdom.io](https://www.devdom.io/)**
- Twitter: **[@itsdevdom](https://twitter.com/itsdevdom)**
