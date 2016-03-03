Package.describe({
  name: 'picsoung:untappd',
  version: '1.0.0',
  // Brief, one-line summary of the package.
  summary: 'OAuth logic to access Untappd API',
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

  api.export('Untappd');

  api.addFiles(
    ['untappd_login_button.css','untappd_client.js','untappd_configure.html', 'untappd_configure.js'],
    'client');

  api.addFiles('untappd_server.js', 'server');
});
