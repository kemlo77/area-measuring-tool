const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
  {
    serverUrl: 'http://localhost:9000',
    options: {
      'sonar.projectName': 'Non-complex polygon',
      'sonar.projectDescription': 'Description for "My App" project...',
      'sonar.sources': 'src, built',
      'sonar.tests': 'test',
      'sonar.exclusions': 'coverage/*, node_modules/*, test/*',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info'
      // 'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info'
    }
  },
  () => process.exit()
)