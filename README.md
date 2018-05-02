<div align="center">

![Github & Travis CI Enhance Status Logo](/assets/icon-48.png?raw=true)

# web-extension-github-travis-status

**Web Extension enhancing the Travis CI status on GitHub pull request pages.**

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

<br><br><br>

## Development details

### Setup locally

Clone the repository & install all dependencies:

```
git clone https://github.com/dominique-mueller/web-extension-github-travis-status.git
cd web-extension-github-travis-status
npm install
```

### Build

Create production build (written into the `dist` folder):

```
npm run build
```

### Toolchain

- The project is written in TypeScript, using the `@types/chrome` typings package
- We use Webpack to create the production bundle, update the `manfiest.json` file and copy assets
- The icon, promotional images and screenshots are created using Adobe After Effects

<br><br><br>

## Creator

**Dominique Müller**

- E-Mail: **[dominique.m.mueller@gmail.com](mailto:dominique.m.mueller@gmail.com)**
- Website: **[www.devdom.io](https://www.devdom.io/)**
- Twitter: **[@itsdevdom](https://twitter.com/itsdevdom)**
