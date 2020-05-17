## Nodax

**Generate Basic CRUD Operations for Express app with sequelize ORM**

## Table of Contents
- [Installation](#installation)
- [Commands](#commands)
- [Commands Demo]()

## Installation

```bash
$ npm install -g  nodax

```
## Commands

commands  | Description
------------- | -------------
nodax init |  Initializes Application setup.
nodax touch  | Initializes .nodax file in which you can set path of controller, route & model folder.
nodax init:controller  |  Initializes controllers folder in your application
nodax init:route |  Initializes routes folder in your application
nodax init:model |  Initializes models folder in your application
nodax generate:rc |  Generates new controller & route files with baisc crud operations.This command requires name(the name of the model) option. e.g `nodax generate:rc --name=User`
nodax generate:route       |   Generates new route file with baisc crud operations..This command requires name(the name of the route & controller) option. e.g `nodax generate:route --name=User`
nodax generate:controller       |  Generates new controller  file with baisc crud operations.This command requires name(the name of the controller) option. e.g `nodax generate:controller --name=User`

## Commands Demo
> **nodax touch**

This command will create .nodaxrc file in root directory of application.
```bash
const path = require('path');

module.exports = {
'controllers': path.resolve('', 'controllers'),
'routes': path.resolve('', 'routes'),
'models': path.resolve('', 'models')
}

```
> **nodax generate:rc --name=User**

This command will create two file one will be route file in routes folder with name ```user-route.js``` and second one will be controllers file in controllers folder with name  ```user-controller.js``` in your application.

user-route.js code will be like
```bash
const router = require('express').Router();
const UserCtrl = require('./controllers/user-controller');
router.get('/users/:id', UserCtrl.getUser);
router.get('/users', UserCtrl.getUser);
router.post('/users', UserCtrl.createUser);
router.put('/users/:id', UserCtrl.updateUser);
router.delete('/users/:id', UserCtrl.removeUser);
module.exports = router;
```
user-controller.js code will be like
```bash
'use strict';
const {
  User
} = require("./models")
module.exports.getUsers = async (req, res, next) => {
  try {
    const {
      params: {
        id
      }
    } = req;
    let data = null;
    if (id) {
      data = await User.findOne({
        where: {
          id
        }
      })
    } else {
      data = await User.findAll({})
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).send(error);
  }
}
module.exports.createUser = async (req, res, next) => {
  try {
    const {
      body: payload
    } = req;
    let resp = await User.create(payload);
    return res.status(200).json(resp);
  } catch (error) {
    return res.status(400).send(error);
  }
}
module.exports.removeUser = async (req, res, next) => {
  try {
    const {
      params: {
        id
      }
    } = req;
    if (!id) {
      throw "Id is required to remove User "
    }
    let resp = await User.destroy({
      where: {
        id
      }
    });
    return res.status(200).json(resp);
  } catch (error) {
    return res.status(400).send(error);
  }
}
module.exports.updateUser = async (req, res, next) => {
  try {
    const {
      params: {
        id
      },
      body: payload
    } = req;
    if (!id) {
      throw "Id is required to update User "
    }
    let resp = await User.update(payload, {
      where: {
        id
      }
    });
    return res.status(200).json(resp);
  } catch (error) {
    return res.status(400).send(error);
  }
}
```
