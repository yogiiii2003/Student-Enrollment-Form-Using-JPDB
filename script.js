var token = "90931482|-31949303243722169|90960143";
var dbname = "SCHOOL-DB";
var relation = "STUDENT-TABLE";
var baseUrl = "http://api.login2explore.com:5577";
//reset values
function formReset() {
  $("#roll").val("");
  $("#name").val("");
  $("#cls").val("");
  $("#dob").val("");
  $("#addr").val("");
  $("#edate").val("");
}
//disabling the values to retrieve it from rollnumber
function disableAll() {
  formReset();
  $("#roll").prop("disabled", false);
  $("#roll").focus();
  $("#name").prop("disabled", true);
  $("#cls").prop("disabled", true);
  $("#dob").prop("disabled", true);
  $("#addr").prop("disabled", true);
  $("#edate").prop("disabled", true);
  $("#save").prop("disabled", true);
  $("#update").prop("disabled", true);
  $("#reset").prop("disabled", true);
}
disableAll();

//command execute function
function executeCommand(reqString, apiEndPointUrl) {
  var url = baseUrl + apiEndPointUrl;
  var jsonObj;
  $.post(url, reqString, function (result) {
    jsonObj = JSON.parse(result);
  }).fail(function (result) {
    var dataJsonObj = result.responseText;
    jsonObj = JSON.parse(dataJsonObj);
  });
  return jsonObj;
}

//to retrieve data from database based on a specific key
function createGET_BY_KEYRequest(
  token,
  dbname,
  relationName,
  jsonObjStr,
  createTime,
  updateTime
) {
  if (createTime !== undefined) {
    if (createTime !== true) {
      createTime = false;
    }
  } else {
    createTime = false;
  }
  if (updateTime !== undefined) {
    if (updateTime !== true) {
      updateTime = false;
    }
  } else {
    updateTime = false;
  }
  var value1 =
    "{\n" +
    '"token" : "' +
    token +
    '",\n' +
    '"cmd" : "GET_BY_KEY",\n' +
    '"dbName": "' +
    dbname +
    '",\n' +
    '"rel" : "' +
    relationName +
    '",\n' +
    '"jsonStr":\n' +
    jsonObjStr +
    "," +
    '"createTime":' +
    createTime +
    "," +
    '"updateTime":' +
    updateTime +
    "\n" +
    "}";
  return value1;
}
//retriving from rollnumber
function findRoll(ele) {
  var roll = ele.value;
  var obj = {
    Roll_No: roll,
  };
  var jsnobj = JSON.stringify(obj);
  var request = createGET_BY_KEYRequest(token, dbname, relation, jsnobj);
  jQuery.ajaxSetup({ async: false });
  var res = executeCommand(request, "/api/irl");
  jQuery.ajaxSetup({ async: true });
  if (res.status == 400) {
    $("#name").prop("disabled", false);
    $("#name").focus();
    $("#cls").prop("disabled", false);
    $("#dob").prop("disabled", false);
    $("#addr").prop("disabled", false);
    $("#edate").prop("disabled", false);
    $("#save").prop("disabled", false);
    $("#reset").prop("disabled", false);
  } else {
    $("#name").prop("disabled", false);
    $("#roll").prop("disabled", true);
    $("#cls").prop("disabled", false);
    $("#dob").prop("disabled", false);
    $("#addr").prop("disabled", false);
    $("#edate").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", false);
    var data = JSON.parse(res.data).record;
    $("#name").val(data.Full_Name);
    $("#cls").val(data.Class);
    $("#dob").val(data.Birth_Date);
    $("#addr").val(data.Address);
    $("#edate").val(data.Enrollment_Date);
  }
}

//http put request to update or modify
function createPUTRequest(connToken, jsonObj, dbName, relName) {
  var putRequest =
    "{\n" +
    '"token" : "' +
    connToken +
    '",' +
    '"dbName": "' +
    dbName +
    '",\n' +
    '"cmd" : "PUT",\n' +
    '"rel" : "' +
    relName +
    '",' +
    '"jsonStr": \n' +
    jsonObj +
    "\n" +
    "}";
  return putRequest;
}

//to save data
function saveData() {
  $("#ajax").html("wait");
  var roll = $("#roll").val();
  var name = $("#name").val();
  var cls = $("#cls").val();
  var dob = $("#dob").val();
  var addr = $("#addr").val();
  var edate = $("#edate").val();
  if (roll == "") {
    $("#roll").focus();
    return;
  }
  if (name == "") {
    $("#name").focus();
    return;
  }
  if (cls == "") {
    $("#cls").focus();
    return;
  }
  if (dob == "") {
    $("#dob").focus();
    return;
  }
  if (addr == "") {
    $("#addr").focus();
    return;
  }
  if (edate == "") {
    $("#edate").focus();
    return;
  }
  var obj = {
    Roll_No: roll,
    Full_Name: name,
    Class: cls,
    Birth_Date: dob,
    Address: addr,
    Enrollment_Date: edate,
  };
  var jsonobj = JSON.stringify(obj);
  var req = createPUTRequest(token, jsonobj, dbname, relation);
  jQuery.ajaxSetup({ async: false });
  var res = executeCommand(req, "/api/iml");
  jQuery.ajaxSetup({ async: true });
  disableAll();
}

//set request
function createSETRequest(
  token,
  jsonStr,
  dbName,
  relName,
  type,
  primaryKey,
  uniqueKeys,
  foreignKeys
) {
  if (type === undefined) {
    type = "DEFAULT";
  }
  var req = {
    token: token,
    cmd: "SET",
    dbName: dbName,
    rel: relName,
    type: type,
    jsonStr: JSON.parse(jsonStr),
  };
  if (primaryKey !== undefined) {
    req.primaryKey = primaryKey;
  }
  if (uniqueKeys !== undefined) {
    req.uniqueKeys = uniqueKeys;
  }
  if (foreignKeys !== undefined) {
    req.foreignKeys = foreignKeys;
  }
  req = JSON.stringify(req);
  return req;
}

//updating the data
function updateData() {
  var roll = $("#roll").val();
  var name = $("#name").val();
  var cls = $("#cls").val();
  var dob = $("#dob").val();
  var addr = $("#addr").val();
  var edate = $("#edate").val();
  if (name == "") {
    $("#name").focus();
    return;
  }
  if (cls == "") {
    $("#cls").focus();
    return;
  }
  if (dob == "") {
    $("#dob").focus();
    return;
  }
  if (addr == "") {
    $("#addr").focus();
    return;
  }
  if (edate == "") {
    $("#edate").focus();
    return;
  }
  var obj = {
    Roll_No: roll,
    Full_Name: name,
    Class: cls,
    Birth_Date: dob,
    Address: addr,
    Enrollment_Date: edate,
  };
  var jsonobj = JSON.stringify(obj);
  var req = createSETRequest(
    token,
    jsonobj,
    dbname,
    relation,
    "UPDATE",
    "Roll_No"
  );
  jQuery.ajaxSetup({ async: false });
  var res = executeCommand(req, "/api/iml/set");
  jQuery.ajaxSetup({ async: true });
  disableAll();
}
