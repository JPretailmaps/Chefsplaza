## Overview
Fanso project

## License
This product is private. do NOT copy or use if have not license.
## Copyright / Author
- Thangchin.co <contact@thangchin.co>
- Tech Fanso <gk@fanso.io>


## Setup

### API
1. Go to api folder, create `.env` file from `config-example > env > api.env`
2. Replace with your configuration
3. Run `yarn` to install dependecies
4. Run `yarn start:dev` for dev env or `yarn build && yarn start` from prod env

### User
1. Go to user folder, create `.env` file from `config-example > env > user.env`
2. Replace with your configuration
3. Run `yarn` to install dependecies
4. Run `yarn dev` for dev env or `yarn build && yarn start` from prod env
5. Open browser and enter `localhost:8081` with `8081` is default port of User

### Admin
1. Go to admin folder, create `.env` file from`config-example > env > admin.env`
2. Replace with your configuration
3. Run `yarn` to install dependecies
4. Run `yarn dev` for dev env or `yarn build && yarn start` from prod env
5. Open browser and enter `localhost:8081` with `8082` is default port of Admin

### Twitter login
- Go o (Twitter app)[https://developer.twitter.com/en/apps] and create an app
- Get consumer key / secret
- Add callback URL `https://yourdomain.com/`, `https://yourdomain.com/fan-register/`, `https://yourdomain.com/auth/model-register`
- Go to admin panel and add consumer key / secret to Social login tab
