Package.describe({
  name: 'babrahams:undo-redo',
  version: '0.0.1',
  summary: 'Undo-redo widget built on babrahams:transactions',
  git: 'https://github.com/JackAdams/meteor-undo-redo.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use('babrahams:transactions@0.7.0');
  api.addFiles('/lib/undo_redo_client.css');
  api.addFiles('/lib/undo_redo_client.html');
  api.addFiles('/lib/undo_redo_client.js');
  api.addFiles('/lib/undo_redo_server.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('babrahams:undo-redo');
  api.addFiles('undo_redo_tests.js');
});
