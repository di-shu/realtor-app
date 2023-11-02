<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="./src/images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Realtor App</h3>

  <p align="center">
    The app helps users find suitable housing for purchase.
    <br />
    <a href="https://github.com/github_username/repo_name"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/github_username/repo_name">View Demo</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Report Bug</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
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
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![Nest][Nest.js]][Nest-url]
- [![Typescript][Typescript]][Typescript-url]
- [![Prisma][Prisma.io]][Prisma-url]
- [![Jest][Jest]][Jest-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Installation and Running

1. Clone the repo
   ```sh
   git clone https://github.com/di-shu/realtor-app.git
   ```
2. Install Yarn packages
   ```sh
   yarn
   ```
3. Enter your DATABASE_URL, JWT_TOKEN_KEY, PRODUCT_KEY_SECRET in `.env`
   ```json
    DATABASE_URL="postgresql://postgres:1111@localhost:5432/postgres"
    JWT_TOKEN_KEY="JWT_TOKEN_KEY"
    PRODUCT_KEY_SECRET="PRODUCT_KEY_SECRET"
   ```
4. Run the project with hot-reloads
   ```sh
   yarn start:dev
   ```
5. Use Postman to test endpoints

### Generates build for production

```
yarn build
```

### Runs unit tests in a console

```
yarn test
```

### Runs unit tests with hot-reloads

```
yarn test:watch
```

### Runs unit tests in a console with coverage collection

```
yarn test:cov
```

### Runs e2e tests

```
yarn test:e2e
```

### Docs

1. Swagger

```sh
To see Swagger docs open `http://localhost:3000/api`
```

2. API diagrams

```sh
You can find and investigate api diagrams in "diagrams" folder of module folder
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] Set up Home module
- [ ] Set up User module
  - [ ] Set up Auth service
- [ ] Achieve a coverage with tests 80%+

See the [open issues](https://github.com/di-shu/realtor-app/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

[@DShulyachenko](https://twitter.com/DShulyachenko) - dmitry.shulyachenko@gmail.com

Project Link: [https://github.com/di-shu/realtor-app](https://github.com/di-shu/realtor-app)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/di-shu/realtor-app.svg?style=for-the-badge
[contributors-url]: https://github.com/di-shu/realtor-app/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/di-shu/realtor-app.svg?style=for-the-badge
[forks-url]: https://github.com/di-shu/realtor-app/network/members
[stars-shield]: https://img.shields.io/github/stars/di-shu/realtor-app.svg?style=for-the-badge
[stars-url]: https://github.com/di-shu/realtor-app/stargazers
[issues-shield]: https://img.shields.io/github/issues/di-shu/realtor-app.svg?style=for-the-badge
[issues-url]: https://github.com/di-shu/realtor-app/issues
[license-shield]: https://img.shields.io/github/license/di-shu/realtor-app.svg?style=for-the-badge
[license-url]: https://github.com/di-shu/realtor-app/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/dmytro-shulyachenko-872195189/
[product-screenshot]: ./src/images/app-screen.png
[Nest.js]: https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white
[Nest-url]: https://nestjs.com/
[Prisma.io]: https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/
[Typescript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://www.typescriptlang.org/
[Jest]: https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white
[Jest-url]: https://docs.nestjs.com/fundamentals/testing
