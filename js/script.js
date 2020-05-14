var xml_text, parser, xmlDoc;
var packages = [];
var packageSteps = [];



/* #region XML source mockup */
xml_text = "<INSTRUKCJA>" +
  "<PACZKA nazwa='BUG_1170_v4'>" +
  "<STEP>1</STEP>" +
  "<STEP_DESCRIPTION>Zainstaluje pakiety</STEP_DESCRIPTION>" +
  "<STEP>2</STEP>" +
  "<STEP_DESCRIPTION>Puśc skrypt konfiguracyjny</STEP_DESCRIPTION>" +
  "</PACZKA>" +
  "<PACZKA nazwa='CL_1787_Fix_v2'>" +
  "<STEP>1</STEP>" +
  "<STEP_DESCRIPTION>Puśc skrypt konfiguracyjny numer 2</STEP_DESCRIPTION>" +
  "</PACZKA>" +
  "</INSTRUKCJA>";
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
  label.setAttribute("for",element);  
  
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

function printCheckboxesToClick(packageName, step, description)
{ 
  var idk = packageName+step;  
  
  var input = document.createElement("input");
  input.type = "checkbox";
  input.name = idk;
  input.id = idk;
  input.onclick = function(){ ValidatePackages(this, packageName); };
  
  var label = document.createElement("label");
  label.setAttribute("for",idk);  
  
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

function ValidatePackages(checkedEl, idToCheck)
{ 
  console.log(checkedEl.checked);
  if (checkedEl.checked)
    {document.getElementById(idToCheck).checked = true;}
  else
    {document.getElementById(idToCheck).checked = false;}
  
  var checkedCheckboxes = CountCheckedCheckboxes();
  var allCheckboxes = CountCheckboxes();
  
  RedrawProgressBar(checkedCheckboxes, allCheckboxes);
  
  
}

function CountCheckedCheckboxes()
{
  var count = 0;
  var checkboxes = document.getElementById("checkboxesToClick"); 
  var inputElems = checkboxes.getElementsByTagName("input");  

  for (var i=0; i<inputElems.length; i++) 
  {       
    if (inputElems[i].type == "checkbox" && inputElems[i].checked == true)
      { count++; }      
  }  
  return count;
}

function CountCheckboxes()
{
  var count = 0;
  var checkboxes = document.getElementById("checkboxesToClick"); 
  var inputElems = checkboxes.getElementsByTagName("input");  

  for (var i=0; i<inputElems.length; i++) 
  {       
    if (inputElems[i].type == "checkbox")
      { count++; }      
  }  
  return count;
}
