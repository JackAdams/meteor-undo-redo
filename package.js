Package.describe({
  name: 'babrahams:undo-redo',
  version: '0.3.3',
  summary: 'Undo-redo widget for babrahams:transactions',
  git: 'https://github.com/JackAdams/meteor-undo-redo.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use('jquery', 'client');
  api.use('tracker', 'client');
  api.use('minimongo', 'client');
  api.use('templating', 'client');
  api.use('spacebars', 'client');
  api.use('underscore');
  api.use('mongo');
  api.imply('mongo');
  api.use('accounts-base');
  api.use('babrahams:transactions@0.8.4');
  api.imply('babrahams:transactions');
  api.addFiles('lib/undo_redo_client.css','client');
  api.addFiles('lib/undo_redo_client.html','client');
  api.addFiles('lib/undo_redo_client.js','client');
  api.addFiles('lib/undo_redo_server.js','server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('babrahams:undo-redo');
  api.addFiles('undo_redo_tests.js');
});
