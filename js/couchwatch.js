$(function(){
  couchwatch.enableCouchWatch("http://localhost:5984/couchwatch");
  couchwatch.debug("ello");

  window.Item = Backbone.Model.extend({
    url: "/logger"
  });

  window.ItemsList = Backbone.Collection.extend({
    url: "/logger",
    descending: true,
    limit: 10,
    model: Item,
    pause: false,

    comparator: function(todo) {
      return todo.get('created_at');
    }
  });

  window.Items = new ItemsList();

  window.ItemView = Backbone.View.extend({
    tagName: "li",

    template: _.template('<span class="severity"><%= severity %></span> - <span class="message"><%= created_at %> : </br></br><%= message %></span>'),

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
      "click a" : "pause"
    },

    initialize: function() {
      console.log("in");

      _.bindAll(this,'addOne', 'addAll', 'pause');
      Items.bind('add', this.addOne);
      Items.bind('refresh', this.addAll);
      Items.fetch();
    },

    pause: function () {
      Items.pause = !Items.pause;
      this.$("a").html(Items.pause ? "continue" : "pause");
      return false;
    },

    addAll: function () {
      Items.each(this.addOne);
    },

    addOne: function (item) {
      var view = new ItemView({model: item});
      if (!Items.pause) {
        this.$("#item-list").prepend(view.render().el)
      }
    }
  });
  new AllItemsView();
});
