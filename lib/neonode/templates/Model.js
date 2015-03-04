var <%= name %> = Class('<%= name %>').inherits(Model)({

  validations : {},

  all : function(callback) {
    application.knex('<%= name %>')
      .exec(callback)
  },

  findBy : function(property, value, callback) {
    property = property || 'id';

    application.knex('<%= name %>')
      .where(property, value)
      .exec(callback)

  },

  findById : function(id, callback) {
    application.knex('<%= name %>')
      .where('id', id)
      .exec(function(err, result) {
        if (err) {callback(err)};

        result = result[0];

        callback(null, result);
      });

  },

  prototype : {

    _create : function _create(callback) {
      var model = this;
      model.createdAt = new Date();
      model.updatedAt = new Date();

      var record = model;

      delete record.eventListeners;

      logger.log('Creating', record)

      application.knex('<%= name %>')
        .insert(record)
        .returning('id')
        .exec(callback);
    },

    _update : function _update(callback) {
      var model = this;

      var id = model.id;

      delete model.id;
      delete model.createdAt;

      var record = model;

      delete record.eventListeners;

      model.updatedAt = new Date();

      application.knex('<%= name %>')
        .where('id', id)
        .update(record)
        .returning('id')
        .exec(callback);
    },

    _destroy function _destroy(callback) {
      var model = this;

      application.knex('<%= name %>')
        .where('id', model.id)
        .del()
        .exec(callback);
    }
  }
});

module.exports = <%= name %>;
