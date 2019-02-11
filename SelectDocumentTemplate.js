// Gets DOM references to the controls we will be working with
const selectControl = document.getElementById('templateSelect');
const selectButton = document.getElementById('selectButton');

// Defines the state variables we will be working with
let state = {
  templates: []
};

// Function we will call on state change to update our controls
function stateChanged() {
  // Disable buttons if no templates exist
  selectButton.disabled = state.templates.length === 0;

  // Clear the dropdown
  selectControl.length = 0;

  // Repopulate the dropdown with new templates
  for (template of state.templates) {
    var option = document.createElement('option');
    option.text = template.name;
    option.value = template.id;
    selectControl.add(option);
  }
}

// Function we call when the radio button selection is changed
function onTemplateTypeChange(value) {
  // Clear the templates, as our template type has changed
  state.templates = [];

  // Submit a request for the new templates
  requestTemplates(value, 'incident').then(templates => {
    // Set the state for the templates we've received
    state.templates = templates;

    // Indicate that we've received the templates and therefore have changed the state
    stateChanged();
  });

  // Indicate that we've cleared the templates and therefore have changed the state
  stateChanged();
}

// The function that is called when the 'Select Document Template' is clicked
function documentTemplateSelected() {}

// Function we call to requests the templates from Dynamics CRM's Web API
function requestTemplates(templateType) {
  // Define the columns we want to retrieve
  const columns = ['associatedentitytypecode', 'name', 'documenttemplateid', 'documenttype'];
  const selectFilter = '$select=' + columns.join();

  // Get Entity Logical Name
  // var parameters = GetGlobalContext().getQueryStringParameters();
  const entityLogicalName = 'incident' || parameters.typename;

  // Filter for only the entity type and template type we're interested in
  const filter = "$filter=associatedentitytypecode eq '" + entityLogicalName + "' and documenttype eq " + templateType;

  // Create the request URL from the columns and filter
  const organizationUrl = '<Your Oranization URL>';
  const apiVersion = 'v8.0';
  const requestUrl = `${organizationUrl}/api/data/${apiVersion}/documenttemplates?${selectFilter}&${filter}`;

  // Create a promise that will resolve when the request is complete
  return new Promise((resolve, reject) => {
    // Create an XML HTTP Request for the data
    var req = new XMLHttpRequest();

    // Set our request location
    req.open('GET', requestUrl);

    // Add the required headers to the request
    req.setRequestHeader('OData-MaxVersion', '4.0');
    req.setRequestHeader('OData-Version', '4.0');
    req.setRequestHeader('Accept', 'application/json');
    req.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    req.setRequestHeader('Prefer', 'odata.include-annotations="OData.Community.Display.V1.FormattedValue"');

    // Add our handler for request state changes
    req.onreadystatechange = function() {
      // Process when request is completed
      if (this.readyState === 4) {
        // Remove callback
        req.onreadystatechange = null;
        if (this.status === 200) {
          var result = JSON.parse(this.response);
          var templates = result.value || [];

          resolve(templates);
        } else {
          reject(this.statusText);
        }
      }
    };

    req.send();
  });
}

onTemplateTypeChange('2');
