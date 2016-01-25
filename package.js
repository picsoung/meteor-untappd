Package.describe({
  name: 'picsoung:uber',
  version: '1.0.1',
  // Brief, one-line summary of the package.
  summary: 'OAuth logic to access Uber API',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('Uber');

  api.addFiles(
    ['uber_login_button.css','uber_client.js','uber_configure.html', 'uber_configure.js'],
    'client');

  api.addFiles('uber_server.js', 'server');
});
