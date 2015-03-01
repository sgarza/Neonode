var validate = require('./../../public/js/vendor/validate');

global.Models = {};

var Model = Class('Model').includes(CustomEvent, CustomEventSupport)({

  constraints : {},

  prototype : {
    errors : [],
    init : function init(properties) {
      if (typeof properties !== 'undefined') {
        Object.keys(properties).forEach(function (property) {
          this[property] = properties[property];
        }, this);
      }
      return this;
    },

    isValid : function isValid () {
      var validationCall, constraints, results, model;

      var valid = true;

      model = this;
      results = [];
      constraints = this.constructor.constraints;

      this.errors = [];

      if (!constraints || Object.keys(constraints).length === 0) {
        return valid;
      }

      var values = {};

      for (var constraint in constraints) {
        if (constraints.hasOwnProperty(constraint)) {
          values[constraint] = model[constraint];
        }
      }

      var result = global.validate(values, constraints);

      if (result) {
        model.errors = result;
        valid = false
      }

      return valid;
    },

    getProperty : function getProperty(property) {
      return this[property];
    },

    setProperty : function setProperty(property, newValue) {
      var originalValue = this[property];

      if (newValue !== originalValue) {
        this[property] = newValue;

        this.dispatch('change', {
          property      : property,
          originalValue : originalValue,
          newValue      : newValue
        });

        this.dispatch('change:' + property, {
          originalValue : originalValue,
          newValue      : newValue
        });
      }

      return this;
    },

    save : function save(callback) {
      var model = this;

      if (!model.isValid()) {
        return callback(model.errors);
      }

      delete model.errors;

      if (!model.hasOwnProperty('id') && model.id !== '') {
        model.create(callback);
      } else {
        model.update(callback);
      }
    },

    create : function create(callback) {
      var model = this;

      model.constructor.dispatch('beforeCreate', {
        data : {
          'model' : model
        }
      });

      model.dispatch('beforeCreate');

      model._create(callback);
    },

    _create : function _create(callback) {
      logger.error('Not implemented _create()');
      callback('Not implemented _create()');
    },

    update : function update(callback) {
      model.constructor.dispatch('beforeUpdate', {
        data : {
          'model' : model
        }
      });

      model.dispatch('beforeUpdate');

      model._update(callback);
    },

    _update : function _update(callback) {
      logger.error('Not implemented _update()');
      callback('Not implemented _update()');
    },

    destroy : function destroy(callback) {
      model.constructor.dispatch('beforeDestroy', {
        data : {
          'model' : model
        }
      });

      model.dispatch('beforeDestroy');

      model._destroy(callback);
    },

    _destroy : function _destroy(callback) {
      logger.error('Not implemented _destroy()');
      callback('Not implemented _destroy()');
    }
  }
});

module.exports = Model;
