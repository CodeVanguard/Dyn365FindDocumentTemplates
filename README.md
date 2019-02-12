# Select Document Templates Sample

This project accompanies the [blog post about how to query and display the document templates for an entity in Dynamics 365](https://www.codevanguard.com/blog/finding-document-templates-for-entities-in-dynamics-365---part-1:-creating-the-control/). Other posts on how to publish these resources will be coming soon.

For now, you can run it in your browser as a standalone page. To do so:

1. Edit the settings on the top of _SelectDocumentTemplate.js_ to point to your instance and API level:

```javascript
// Arguments to get it working in your local environment
const organizationUrl = '<Your Oranization URL>';
const apiVersion = 'v8.0';
```

2. Open _SelectDocumentTemplate.html_ in a Chrome instance where CORS is disabled.
