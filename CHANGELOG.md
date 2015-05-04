## 2015-05-04, Version 2.0.5

- **Updates**
     - Update neonode-core to 2.1.0


## 2015-04-22, Version 2.0.4

- **Updates**
     - Update Webpack Compression plugin to 0.2.0
     - Add Webpack autoprefixer-loader
     - Add npm badge to README


## 2015-03-30, Version 2.0.3

- **Bugfixes**
     - Fix hashids typo in 08_locals.js middleware

## 2015-03-30, Version 2.0.2

- Add NotFound and Error middlewares
- **Bugfixes**
     - Add missing dependencies (Neon)


## 2015-03-26, Version 2.0.1

- **Bugfixes**
     - Fix syntax errors in Redis Middleware
     - Change the order of middlewares


## 2015-03-26, Version 2.0.0

 - **Modularization**
     - [neonode-core](https://github.com/sgarza/neonode-core)
 - **Middlewares directory**
     - All express middlewares are part of the base Neonode Module to be able to tweak them or to add more. Middlewares are loaded in filename ASC order.
 - **Updatability**
     - All projects created with Neonode > v2.0.0 can be updated (at least the [neonode-core](https://github.com/sgarza/neonode-core) module)
 - **Webpack**
     - Removed the *webpack-dev-middleware* module as it doesn't render the packed file to disk. We will stick to Webpack CLI for now.


