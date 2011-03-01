$(function(){
  window.Item = Backbone.Model.extend({
    url: "/logger"
  });

  window.ItemsList = Backbone.Collection.extend({
    url: "/logger",
    model: Item
  });
});
