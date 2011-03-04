function (doc, req) {
  var newDoc = {};
  newDoc._id = req.uuid;
  newDoc.created_at = new Date();
  newDoc.severity = req.form.severity;
  newDoc.message = req.form.message;
  newDoc.peer = req.peer;
  newDoc.type = "logger";
  return [newDoc, "ok"]
}
