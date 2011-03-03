$(function(){
  couchwatch.enableCouchWatch("http://localhost:5984/couchwatch");
  couchwatch.debug("ello" + new Date());

  window.Item = Backbone.Model.extend({
    url: "logger"
  });

  window.ItemsList = Backbone.Collection.extend({
    url: "allLoggers",
    descending: true,
    limit: 5,
    model: Item,
    pause: false,

    comparator: function(todo) {
      return - todo.get('created_at');
    }
  });

  window.Items = new ItemsList();

//  Items.sortBy(function(item) {
//    return - item.get("created_at");
//  });

//  Items.create({"created_at": new Date(), "message": "message", "severity": "debug"}, {
//    success: function() {
//      Items.first().fetch();
//      //Items.first().destroy();
//    }
//  });


  window.ItemView = Backbone.View.extend({
    tagName: "li",

    template: _.template('<%= id %> - <span class="severity"><%= severity %></span> - <span class="message"><%= created_at %> : </br></br><%= message %></span>'),

    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
      this.model.view = this;
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    }

  });

  window.AllItemsView = Backbone.View.extend({
    el: $("#items"),

    events : {
      "click .pause" : "pause",
      "click .add" : "add"
    },

    initialize: function() {
      console.log("in");

      _.bindAll(this,'render', 'pause', 'add', 'addNew');
      Items.bind('add', this.addNew);
      Items.bind('refresh', this.render);
      Items.fetch();
    },

    add: function () {
      Items.create({"created_at": new Date(), "message": "message", "severity": "debug"});
      return false;
    },

    pause: function () {
      Items.pause = !Items.pause;
      this.$(".pause").html(Items.pause ? "continue" : "pause");
      if (!Items.pause)
        Items.fetch();
      return false;
    },

    addNew: function (item) {
      var view = new ItemView({model: item});
      if (!Items.pause)
        $("#item-list").prepend(view.render().el);
    },


    render: function () {
      Items.models = Items.models.slice(0, 100);
      this.$("#item-list").html("");
      Items.each(function(item) {
        var view = new ItemView({model: item});
        $("#item-list").prepend(view.render().el);
      });
    }

  });
  new AllItemsView();
});
