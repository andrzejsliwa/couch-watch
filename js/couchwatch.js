$(function(){
//    var changesFeed = null;
//
//    var db = $.couch.db("couchwatch");
//
//    db.info( {
//      success: function ( data ) {
//        var since = ( data.update_seq || 0);
//        changesFeed = db.changes( since, { include_docs: true, limit: 100 } );
//        changesFeed.onChange( function( changes ) {
//          _.each( changes.results, function( row ) {
//            var doc = row.doc;
//            if ( doc.type == "logger") {
//              result = "<li><span class='severity'>" + doc.severity + "</span> - <span class='message'>" + doc.created_at + "</br></br>" + doc.message + "</span></li>";
//              $("#item-list").prepend($(result));
//            }
//          })
//        });
//      },
//      error: function () {
//      }
//    });


couchwatch.enableCouchWatch("http://localhost:5984/couchwatch");
couchwatch.debug("ello" + new Date());

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
      return - todo.get('created_at');
    }
  });

  window.Items = new ItemsList();



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
      Items.models.shift();
      console.log(Items.models.length);
      var view = new ItemView({model: item});
      if (!Items.pause) {
        var all = $("#items li");
        $(all[all.length - 1]).remove();
        $("#item-list").prepend(view.render().el);
      }
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
