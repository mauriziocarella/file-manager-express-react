

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<!--
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
-->


<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/mauriziocarella/file-manager">
    <img src=".github/images/logo.png?raw=true" alt="Logo" width="150" height="150">
  </a>

<h3 align="center">File Manager</h3>

  <p align="center">
    NodeJS + MongoDB ready file manager with label, tags and search support
    <!--<br />
    <a href="https://github.com/mauriziocarella/file-manager"><strong>Explore the docs »</strong></a>-->
    <br />
    <!--<br />
    <a href="https://github.com/mauriziocarella/file-manager">View Demo</a>
    ·-->
    <a href="https://github.com/mauriziocarella/file-manager/issues">Report Bug</a>
    ·
    <a href="https://github.com/mauriziocarella/file-manager/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<h2 style="display: inline-block">Table of Contents</h2>
<ol>
 <li>
   <a href="#about-the-project">About The Project</a>
   <ul>
     <li><a href="#built-with">Built With</a></li>
   </ul>
 </li>
 <li>
   <a href="#getting-started">Getting Started</a>
   <ul>
     <!--<li><a href="#prerequisites">Prerequisites</a></li>-->
     <li><a href="#installation">Installation</a></li>
   </ul>
 </li>
 <li><a href="#usage">Usage</a></li>
 <!--<li><a href="#roadmap">Roadmap</a></li>-->
 <!--<li><a href="#contributing">Contributing</a></li>-->
 <li><a href="#license">License</a></li>
 <li><a href="#contact">Contact</a></li>
 <!--<li><a href="#acknowledgements">Acknowledgements</a></li>-->
</ol>



<!-- ABOUT THE PROJECT -->
## About The Project

![Screenshot](.github/images/screenshot-01.png?raw=true "Screenshot")

**File Manager** is a ready-to-use platform to manage files of any type (*audio, video, documents*).
It has an internal video preview (support for more file types preview will be ready shortly).

When started the server read configured content directory and *indexes* all files in the database. A manual *sync* is available in the internal views.

*Search* for files is available by title, label, filename, tags and more.

All *registered users* can see all files.


### Built With

* [TailwindCSS](https://tailwindcss.com/)
* [ReactJS](https://reactjs.org/)
* [ExpressJS](https://expressjs.com/)
* [NodeJS](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.com/)
* [Mongoose](https://mongoosejs.com/)

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

<!--
### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```
-->

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/mauriziocarella/file-manager.git
   ```
2. Install Server NPM packages
   ```sh
   npm install
   ```
3. Install Client NPM packages
   ```sh
   cd www
   npm install
   ```
4. Build Client
   ```sh
   npm run build
   ```



<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

1. Copy `.env.example` to `.env` and set `APP_SECRET`
   ```sh
   cp .env.example .env
   vi .env
   ```
2. Start server
   ```sh
   npm run start
   ```



<!-- ROADMAP -->
<!--
## Roadmap

See the [open issues](https://github.com/mauriziocarella/file-manager/issues) for a list of proposed features (and known issues).
-->


<!-- CONTRIBUTING -->
<!--
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
-->


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

[Maurizio Carella](https://github.com/mauriziocarella) - [mauriziocarella.it](https://mauriziocarella.it) - info@mauriziocarella.it

<!-- ACKNOWLEDGEMENTS -->
<!--## Acknowledgements

* []()
* []()
* []()
-->




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/mauriziocarella/repo.svg?style=for-the-badge
[contributors-url]: https://github.com/mauriziocarella/file-manager/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/mauriziocarella/repo.svg?style=for-the-badge
[forks-url]: https://github.com/mauriziocarella/file-manager/network/members
[stars-shield]: https://img.shields.io/github/stars/mauriziocarella/repo.svg?style=for-the-badge
[stars-url]: https://github.com/mauriziocarella/file-manager/stargazers
[issues-shield]: https://img.shields.io/github/issues/mauriziocarella/repo.svg?style=for-the-badge
[issues-url]: https://github.com/mauriziocarella/file-manager/issues
[license-shield]: https://img.shields.io/github/license/mauriziocarella/repo.svg?style=for-the-badge
[license-url]: https://github.com/mauriziocarella/file-manager/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/mauriziocarella/
