// Import common auth helpers
import "./auth-helpers";

// Disable uncaught exception handling for development
// Uncomment if you want to catch unhandled exceptions
// Cypress.on('uncaught:exception', (err, runnable) => {
//   return false
// })

// Common cypress configurations
beforeEach(() => {
  // Set viewport for consistency
  cy.viewport(1280, 720);

  // Disable animations for faster tests
  cy.window().then((win) => {
    if (win.document.documentElement) {
      win.document.documentElement.style.setProperty("--animation-duration", "0.01ms");
    }
  });
});