function (doc, req) {
  var newDoc = {};
  newDoc._id = req.uuid;
  newDoc.create_at = new Date().toString();
  newDoc.severity = req.form.severity;
  newDoc.message = req.form.message;
  newDoc.peer = req.peer;
  newDoc.collection = "logger";
  return [newDoc, "ok"]
}
