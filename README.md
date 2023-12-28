<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

<h1 align="center">
  <br>
  Tacohouse
  <br>
</h1>

<br>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#download">Download</a> •
  <a href="#credits">Credits</a> •
  <a href="#related">Related</a> •
  <a href="#license">License</a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Requirement

- Have yarn
- This project use yarn
- Have docker

## Installation - How to use

```bash
$ git clone https://github.com/dsitweed/tacohouse-be

$ yarn install

$ yarn db:dev:restart

$ yarn start:dev

# run migrate prisma
$ npx prisma migrate dev

# Seed database
$ npx prisma db seed
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov

```

## Linting and formatting

```bash
# Lint and autofix with eslint
$ npm run lint

# Format with prettier
$ npm run format
```

# Design structure

## Data base design link: https://dbdiagram.io/d/64acf24602bd1c4a5ed93b65

### Các cụm chức năng - Key Features:

1. User

- CRUD
- Login
- Register (Ngay từ khi register đã cần nhập đủ các thông tin + chọn role)
- Logout
- Update information (Bao gồm cả thay đổi mật khẩu)
- Chuyển đổi role (Pending - Sẽ cần thỏa mãn các điều kiện trước khi chuyển đổi - Không có phòng cho thuê, hoặc đang không thuê phòng nào cả <=> reset về new user)

2. Manager

- Hiện tại chưa hỗ trợ trong tương lai phát triển thì các chức năng chắc cũng sẽ không nhiều

3. Tenant

- Đăng ký cho tenant vào thuê 1 phòng (tự động trạng thái phòng -> is_active = false)
- CRUD
- Delete chỉ chuyển trạng thái is_active = false

4. Building

- CRUD

5. Room

- CRUD
- Chuyển trạng thái phòng (Chức năng ít dùng - có thể chuyển về is_active = True khi phòng đấy đang có người ở nhưng sắp chuyển đi -> Rao cho thuê trước)
- Đăng ký số ngày mà phòng sẽ trống trong tương lai
- Đang góc nhìn FE: Chuyển trạng thái phòng (Mặc định is_active = true sẽ đăng thông tin phòng nên trang chủ) - 1 route riêng biệt
- Đang góc nhìn FE: Route thuê phòng: Các thông tin cơ bản của phòng hiển thị (ko đc sửa, sửa ở route 1)
- 2 route trên vẫn là Update mà thôi

6. Facility

- CRUD

7. Invoice

- CRUD
- Route delete cần cẩn thận làm thật bảo mật và an toàn - chắc sẽ chưa hiện ngay lên FE

8. Image

- Đăng ảnh
- Xóa ảnh

9. Thống kê + filter

- Lấy thông tin các building của 1 manager
- Lấy thông tin các phòng: ko có gì cả - lấy tất cả các phòng đang quản lý của manager, lấy các phòng của 1 building, lấy các phòng đang có trạng thái is_active = true / false;
- Lấy các phòng theo thời gian sắp bị trống, hoặc theo biến số ngày

10. Chat

- Qua socket của web
- Nhắn tin qua zalo - Không thể vì yêu cầu là doanh nghiệp và có các giấy từ pháp nhân

# Install package - Tech

```bash
# DB - Postgres

# ORM - Prisma
yarn add -D prisma
yarn add @prisma/client

# Test = PactumJS is a Node.js project + Test runner: Jest - already installed by default with nestjs
yarn add -D pactum

#  Hash password
yarn add argon2

# Class Validation - Pipe in nestJS
yarn add class-validator class-transformer

# Jwt passport -> authentication
yarn add @nestjs/jwt @nestjs/passport passport-jwt passport
yarn add -D @types/passport-jwt

# configService for use .env file in app
yarn add @nestjs/config

# dotenv-cli for test
yarn add -D dotenv-cli

# joi for validation .env file
yarn add joi

# Sử dụng socket.io
yarn add @nestjs/websockets @nestjs/platform-socket.io

# Fire base Admin for server
yarn add firebase-admin
# File upload nestjs
yarn add -D @types/multer

# Faker
yarn add -D @faker-js/faker

# Swagger
yarn add @nestjs/swagger
```

### `Firebase`

```bash
npm install firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4ieuauG2fN5h53MD1vUPixzA3TcUxb8o",
  authDomain: "tacohouse-101e1.firebaseapp.com",
  projectId: "tacohouse-101e1",
  storageBucket: "tacohouse-101e1.appspot.com",
  messagingSenderId: "411781811301",
  appId: "1:411781811301:web:886697d341923c0333ca8c",
  measurementId: "G-MSYL8BZ2V3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
```

# Note:

- Khi tạo tài khoản (Cần email, password, role) -> tạo User
  - -> tài khoản Tenant hoặc Manager hoặc Admin

* [Documentation of TacoHouse](https://docs.google.com/spreadsheets/d/14KMTWs6TFY7ulHDhdgqIXJCCnXudpSwOw-83UEgn5bE/edit?usp=sharing)

* Ở đây phòng khi bị trống: gọi là room available
* Git commmit [rule](https://dev.to/ashishxcode/mastering-the-art-of-writing-effective-github-commit-messages-5d2p?fbclid=IwAR0PNnH_tbIVV_CR4KU4wcKurgkEi8s5Lvot6CB3whKJesnm1a33wvUuUs0)

## Commit rule

- `build`: Build related changes (eg: npm related/ adding external dependencies)
- `chore`: A code change that external user won't see (eg: change to .gitignore file or .prettierrc file)
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation related changes
- `refactor`: A code that neither fix bug nor adds a feature. (eg: You can use this when there is semantic changes like renaming a variable/ function name)
- `perf`: A code that improves performance
- `style`: A code that is related to styling
- `test`: Adding new test or making changes to existing test

## Bug when coding

1. Cannot find module 'src/app.module' from 'app.e2e-spec.ts'

- Solution: fix jest-e2e.json file
- add config:

```json
...
"moduleNameMapper": {
  "^src/(.*)": "<rootDir>/../src/$1"
}
```

2. Module Manager đang có những route trùng với những route của building, room, khi lấy những building, room, bản thân đang quản lý.

- Đang không biết để những route này ở đâu: ở moduel manager hay ở module me, hay module nguyên gốc

## Tài liệu tham khảo

```bash
https://github.com/vladwulf/nestjs-api-tutorial/blob/main/test/app.e2e-spec.ts
```

## Credits

This software uses the following open source packages:

- [Node.js](https://nodejs.org/)
- [Marked - a markdown parser](https://github.com/chjj/marked)
- [showdown](http://showdownjs.github.io/showdown/)
- [CodeMirror](http://codemirror.net/)
- Emojis are taken from [here](https://github.com/arvida/emoji-cheat-sheet.com)

## Support

<a href="https://www.buymeacoffee.com/5Zn8Xh3l9" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/purple_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

## License

MIT

---
