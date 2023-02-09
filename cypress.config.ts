import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      // implement node event listeners here
    },
    'baseUrl': 'http://localhost:5600',
    'viewportWidth': 1920,
    'viewportHeight': 1080
  },
});
