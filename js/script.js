var xml_text, parser, xmlDoc;
var packages = [];
var packageSteps = [];

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

parser = new DOMParser();
xmlDoc = parser.parseFromString(xml_text,"text/xml");

printTXT = '';
txt = "";
x = xmlDoc.getElementsByTagName("STEP");
y = xmlDoc.getElementsByTagName("STEP_DESCRIPTION");

for (i = 0; i < x.length; i++) {
    var p = x[i].parentNode.getAttribute('nazwa');
    //var s = x[i].nodeName + ": " + x[i].childNodes[0].nodeValue + " =>   ";
    //var d = y[i].nodeName + ": " + y[i].childNodes[0].nodeValue + "<br>";
    var s = x[i].childNodes[0].nodeValue;
    var d = y[i].childNodes[0].nodeValue;
  
    packages.push(x[i].parentNode.getAttribute('nazwa'));
    var packageStep = {package:p, step:s, description:d};
    packageSteps.push(packageStep);
    
    txt += packageStep.package;
    txt += packageStep.step;
    txt += packageStep.description;    
}



PrintPackagesSteps("demo", packageSteps)

// Lista paczek
txt = '';
PrintPackagesList("paczki", packages)

// Prinsts packages List
function PrintPackagesList(htmlItem, packagesArray)
{
  var packagesSet = new Set(packagesArray);
  
  txt = '<table class="instrukcje">';
  txt += "<th>Nazwa paczki</th><th>Czy zrobione</th>";
  packagesSet.forEach(JoinTxtForPackagesList);
  
  txt += '</table>';
  document.getElementById(htmlItem).innerHTML = txt;  
}

function JoinTxtForPackagesList(value) {
  txt = txt + "<tr><td>" + value + "</td><td><input type=checkbox></td></tr>";
}

// Lista instrukcji
function PrintPackagesSteps(htmlItem, packagesStepsArray)
{
    
    printTXT = "<table class=instrukcje>";
    printTXT += "<th>Nazwa paczki</th><th>Numer kroku</th><th>Instrukcja</th><th>Czy zrobione</th>";
    for (i = 0; i < packagesStepsArray.length; i++) {
      printTXT += "<tr><td>";
      printTXT += packagesStepsArray[i].package + "</td><td>";
      printTXT += packagesStepsArray[i].step + "</td><td>";
      printTXT += packagesStepsArray[i].description + "</td><td>";
      printTXT += "<input type=checkbox>"
      printTXT += "</td></tr>";
    }
      
    printTXT += "</table>";
    
    document.getElementById(htmlItem).innerHTML = printTXT;
}







