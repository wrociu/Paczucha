var xml_text, parser, xmlDoc;
var packages = [];
var packageSteps = [];

/* #region open File - handler */
function readBlob() {

  var files = document.getElementById('files').files;
  if (!files.length) {
    alert('Please select a file!');
    return;
  }

  var file = files[0];
  var start = 0;
  var stop = file.size - 1;

  var reader = new FileReader();

  // If we use onloadend, we need to check the readyState.
  reader.onloadend = function (evt) {
    if (evt.target.readyState == FileReader.DONE) { // DONE == 2
      document.getElementById('byte_content').textContent = evt.target.result;
      xml_text = evt.target.result;
      START();
    }
  };

  var blob = file.slice(start, stop + 1);
  reader.readAsBinaryString(blob);
  
}

document.querySelector('.readBytesButtons').addEventListener('click', function (evt) {
  if (evt.target.tagName.toLowerCase() == 'button') {
    readBlob();
  }
}, false);
/* #endregion */

/* #region XML source mockup */
// xml_text = "<INSTRUKCJA>" +
//   "<PACZKA nazwa='BUG_1170_v4'>" +
//   "<STEP>1</STEP>" +
//   "<STEP_DESCRIPTION>Zainstaluje pakiety</STEP_DESCRIPTION>" +
//   "<STEP>2</STEP>" +
//   "<STEP_DESCRIPTION>Puśc skrypt konfiguracyjny</STEP_DESCRIPTION>" +
//   "</PACZKA>" +
//   "<PACZKA nazwa='CL_1787_Fix_v2'>" +
//   "<STEP>1</STEP>" +
//   "<STEP_DESCRIPTION>Puśc skrypt konfiguracyjny numer 2</STEP_DESCRIPTION>" +
//   "</PACZKA>" +
//   "</INSTRUKCJA>";
/* #endregion */



/* #region Page Loading events */
document.addEventListener("DOMContentLoaded", documentReady);

function documentReady() {
  RedrawProgressBar(0, 100);
}
/* #endregion */



/* #region Progress bar handling */
function RedrawProgressBar(progress, all) {
  var progressBar = document.getElementById("progress");
  var progressBarWidth = Math.floor((progress / all) * 100)
  progressBar.style.width = progressBarWidth + "%";
}
/* #endregion */



/* #region Loading data to packages and  packageSteps*/
function START() {
  parser = new DOMParser();
  xmlDoc = parser.parseFromString(xml_text, "text/xml");

  printTXT = '';
  txt = "";
  x = xmlDoc.getElementsByTagName("STEP");
  y = xmlDoc.getElementsByTagName("STEP_DESCRIPTION");

  for (i = 0; i < x.length; i++) {
    var p = x[i].parentNode.getAttribute('nazwa');
    var s = x[i].childNodes[0].nodeValue;
    var d = y[i].childNodes[0].nodeValue;

    packages.push(x[i].parentNode.getAttribute('nazwa'));
    var packageStep = {
      package: p,
      step: s,
      description: d
    };
    packageSteps.push(packageStep);

    txt += packageStep.package;
    txt += packageStep.step;
    txt += packageStep.description;
  }

  PrintPackagesSteps(packageSteps);
  PrintPackagesList(packages);
}
/* #endregion */

/* #region Packages list */
function PrintPackagesList(packagesArray) {

  var packagesSet = new Set(packagesArray);
  packagesSet.forEach(JoinTxtForPackagesList);

}

function JoinTxtForPackagesList(element) {

  var input = document.createElement("input");
  input.type = "checkbox";
  input.id = element;

  var label = document.createElement("label");
  label.setAttribute("for", element);

  var span = document.createElement("span");

  var checkboxes = document.getElementById("checkboxes");

  var t = document.createTextNode(element);
  label.appendChild(span);
  label.appendChild(t);
  checkboxes.appendChild(input);
  checkboxes.appendChild(label);
  checkboxes.appendChild(document.createElement("br"));

}
/* #endregion */

/* #region Packages Steps */
function PrintPackagesSteps(packagesStepsArray) {

  for (i = 0; i < packagesStepsArray.length; i++) {
    printCheckboxesToClick(packagesStepsArray[i].package, packagesStepsArray[i].step, packagesStepsArray[i].description);
  }
}

function printCheckboxesToClick(packageName, step, description) {
  var idk = packageName + step;

  var input = document.createElement("input");
  input.type = "checkbox";
  input.name = packageName;
  input.id = idk;
  input.onclick = function () {
    ValidatePackages(this, packageName);
  };

  var label = document.createElement("label");
  label.setAttribute("for", idk);

  var span = document.createElement("span");

  var checkboxesToClick = document.getElementById("checkboxesToClick");

  var t = document.createTextNode(step + "  |  " + packageName + "  |  " + description);
  label.appendChild(span);
  label.appendChild(t);
  checkboxesToClick.appendChild(input);
  checkboxesToClick.appendChild(label);
  checkboxesToClick.appendChild(document.createElement("br"));
}
/* #endregion */

function ValidatePackages(checkedEl, idToCheck) {

  checkedByNameCount = CountCheckedCheckboxes(checkedEl.name);
  allCheckedByNameCount = CountCheckboxes(checkedEl.name);

  if (checkedByNameCount == allCheckedByNameCount) {
    document.getElementById(idToCheck).checked = true;
  } else {
    document.getElementById(idToCheck).checked = false;
  }

  var checkedCheckboxes = CountCheckedCheckboxes();
  var allCheckboxes = CountCheckboxes();

  RedrawProgressBar(checkedCheckboxes, allCheckboxes);

}

// parName can be null
// if null it counts for all checkboxes
function CountCheckedCheckboxes(parName) {
  var count = 0;
  var checkboxes = document.getElementById("checkboxesToClick");
  var inputElems = checkboxes.getElementsByTagName("input");

  if (name == null)
    console.log("name jest null");

  for (var i = 0; i < inputElems.length; i++) {
    if (inputElems[i].type == "checkbox" && inputElems[i].checked == true && (inputElems[i].name == parName || parName == undefined)) {
      count++;
    }
  }

  return count;
}


// parName can be null
// if null it counts for all checkboxes
function CountCheckboxes(parName) {
  var count = 0;
  var checkboxes = document.getElementById("checkboxesToClick");
  var inputElems = checkboxes.getElementsByTagName("input");

  for (var i = 0; i < inputElems.length; i++) {
    if (inputElems[i].type == "checkbox" && (inputElems[i].name == parName || parName == undefined)) {
      count++;
    }
  }
  return count;
}