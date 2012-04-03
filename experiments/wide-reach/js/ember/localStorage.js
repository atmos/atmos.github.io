var get = Ember.get, set = Ember.set, getPath = Ember.getPath;

DS.localStorageAdapter = DS.Adapter.extend({
  createRecord: function(store, type, model) {
    var records = this.local.get(type) || { };
    var id = records.length + 1;
    model.set('id', id)

    var data = get(model, 'data')
    data.created_at = new Date()
    records[id] = data;

    this.local.set(type, records);
    store.didCreateRecord(model, data);
  },
  updateRecord: function(store, type, model) {
    var id = get(model, 'id');
    var data = get(model, 'data');

    var records = this.local.get(type);
    records[id] = data;
    data.updated_at = new Date()

    this.local.set(type, records);
    store.didUpdateRecord(model, data);
  },

  find: function(store, type, id) {
    var result = null
      , record = null
      , records = this.local.get(type)

    for(i = 0; i < records.length; i++) {
      record = records[i]
      if(record.id == id)
        result = store.load(type, id, record)
    }
    return result
  },

  findAll: function(store, type) {
    var records = this.local.get(type);

    if (records) {
      store.loadMany(type, records)
    }
  },

  findQuery: function(store, type, query, modelArray) {
    var results = [ ]
      , requiredKeys = Object.keys(query)

    this.local.get(type).forEach(function(record) {
      var found = true
      for(j = 0; j < requiredKeys.length; j++) {
        keyName = requiredKeys[j]
        if(record[keyName] !== query[keyName]) {
          found = false
          break
        }
      }
      if(found) {
        results.push(record)
      }
    })
    modelArray.load(results)
  },


  local: {
    set: function(key, value) {
      var rhs = value.filter(function(){return true});
      localStorage.setItem(key, JSON.stringify(rhs));
    },
    get: function(key) {
      var value = localStorage.getItem(key);
      value = JSON.parse(value) || [];
      return value;
    }
  }
});
