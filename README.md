[![CircleCI](https://dl.circleci.com/status-badge/img/gh/swawozny/top-forum-backend/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/swawozny/top-forum-backend/tree/master)

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/swawozny/top-forum-backend">
    <img src="https://i.postimg.cc/9QHyYjqF/logo.png" alt="Logo" width="340" height="80">
  </a>

<h3 align="center">TOP-FORUM.ONLINE BACK-END</h3>

  <p align="center">
    Back-end of web forum application.
    <br />
<!--     <a href="https://github.com/github_username/repo_name"><strong>Explore the docs »</strong></a>
    <br /> -->
    <br />
    <a href="https://top-forum-backend.onrender.com">View Demo</a>
    ·
    <a href="https://github.com/swawozny/top-forum-backend/issues">Report Bug</a>
    ·
    <a href="https://github.com/swawozny/top-forum-backend/issues">Report Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Third-party libraries used in project</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

The back-end of an application that enables users to exchange information, viewpoints, experiences, and opinions on a wide range of topics.

### Third-party libraries used in project

- [bcrypt](https://www.npmjs.com/package/bcrypt): to hash password with a salt
- [body-parser](https://www.npmjs.com/package/body-parser): to extract the information from incoming requests
- [cors](https://www.npmjs.com/package/cors): to serve third-party origins
- [dotenv](https://www.npmjs.com/package/dotenv): to retrieve .env config file
- [express](https://expressjs.com): web application framework for Node.js
- [express-validator](https://express-validator.github.io/docs): to validate data from requests
- [helmet](https://www.npmjs.com/package/helmet): to add request HTTP headers
- [http-status-codes](https://www.npmjs.com/package/http-status-codes): to return HTTP status codes
- [nodemailer](https://www.npmjs.com/package/nodemailer): connect with virtual mailbox
- [sequelize](https://sequelize.org): ORM
- [xss-clean](https://github.com/jsonmaur/xss-clean): to sanitaze data

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

These are the instructions for setting up the project locally. To get a local copy up and running, follow these simple example steps.

### Prerequisites
* [npm](https://www.npmjs.com/get-npm)
* [Node.js](https://nodejs.org/en/blog/release)
* [PostgreSQL Database](https://www.npmjs.com/get-npm)

### Installation

### Setup Application
**1. Clone this repository to your local machine**
```
$ git clone https://github.com/swawozny/top-forum-backend
```

**2. Install backend packages via npm**
```
$ cd top-forum-backend
$ npm install
```

**3. Create .env file**
```
$ touch .env
```

**4. Sign up for the following services**
- [Mailtrap](https://mailtrap.io)：create a virtual mailbox for sending emails.

**5. Store environment variables in .env file then save**
```
#SERVER DATA
APP_HOST=SKIP
PORT=SKIP

#POSTGRESQL DATA
TEST_DB=SKIP
DEV_DB=SKIP
DB_USERNAME=SKIP
DB_PASSWORD=SKIP
DB_PORT=SKIP
DB_HOST=SKIP

#MAILTRAP DATA
MAIL_HOST=SKIP
MAIL_PORT=SKIP
MAIL_USER=SKIP
MAIL_PASSWORD=SKIP
MAIL_DEFAULT=SKIP

#JWT DATA
JWT_PRIVATE_KEY=SKIP
JWT_EXPIRATION=SKIP
```
**6. Create database, Run migration, Add Seeder**
```
$ npx sequelize db:create
$ npx sequelize db:migrate
$ npx sequelize db:seed:all
```
**7. Run server**
```
$ npm start
```

Server is now available under http://localhost:PORT, where PORT is the same as you define in .env file.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTRIBUTING -->
## Contributing

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

Sebastian Wąwoźny - sebastianwawozny@wp.pl

Project Link: [https://github.com/swawozny/top-forum-backend](https://github.com/swawozny/top-forum-backend)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
