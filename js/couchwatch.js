$(function(){

  window.Item = Backbone.Model.extend({
    url: "logger"
  });

  window.ItemsList = Backbone.Collection.extend({
    url: "allLoggers",
    descending: true,
    limit: 100,
    model: Item,
    pause: false,

    comparator: function(todo) {
      return new Date(todo.get('created_at'));
    }
  });

  window.Items = new ItemsList();



  window.ItemView = Backbone.View.extend({
    tagName: "li",

    template: _.template('<%= id %> - <span class="severity"><%= severity %></span> - <span class="message"><%= created_at %> : </br></br><%= message %></span>'),

    initialize: function() {
      _.bindAll(this, 'render', 'unrender');
      this.model.bind('change', this.render);
      this.model.view = this;
    },

    unrender: function() {
      $(this.model.el).remove();
      return this;
    },

    render: function(search) {
      var el = $(this.el);
      el.html(this.template(this.model.toJSON()));
      this.model.el = el;
      if (search) {
        if (el.text().search(search) > 0) {
          el.html(el.text().replace(search, "<strong>" + search +"</strong>"));
          el.css("background-color", "yellow");
          this.el.matched = true;
        }
      }
      return this;
    }

  });

  window.AllItemsView = Backbone.View.extend({
    el: $("#items"),

    events : {
      "click #pause": "pause",
      "click #refresh": "refresh",
      "click #add": "add",
      "click #wait_for": "search"

    },

    initialize: function() {
      //console.log("in");
      this.items_element = $("#item-list");
      _.bindAll(this, 'renderNew', 'render', 'pause', 'add', 'search', 'refresh', 'showSearch');
      Items.bind('add', this.renderNew);
      Items.bind('refresh', this.render);
      Items.fetch();
    },

    refresh: function () {
      this.render();
      return false;
    },

    add: function () {
      Items.create({"created_at": new Date(), "message": "message", "severity": "debug"});
      return false;
    },

    search: function(e) {
      this.$("#pause").html(Items.pause ? "continue" : "pause");
      var input = this.$("input");
      this.search = input.val();
      this.$("#search-text").text("Wait for : '"+ this.search + "'");
      input.val("");
    },

    pause: function () {
      Items.pause = !Items.pause;
      this.$("#pause").html(Items.pause ? "continue" : "pause");
      if (!Items.pause)
        Items.fetch();
      return false;
    },

    renderNew: function (item) {
      var old = Items.models.shift();
      if (!Items.pause) {
        new ItemView({model: old}).unrender();
        var el = new ItemView({model: item}).render(this.search).el;
        this.items_element.prepend(el);
        if (el.matched) this.pause();
      }
    },

    render: function () {
      Items.models = Items.models.slice(0, Items.limit);
      this.items_element.html("");
      var that = this;
      Items.each(function(item) {
        var view = new ItemView({model: item}),
          el = view.render(this.search).el;
        that.items_element.prepend(el);
      });
    }

  });
  new AllItemsView();
});
