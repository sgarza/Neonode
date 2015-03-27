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


