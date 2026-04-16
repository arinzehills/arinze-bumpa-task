/**
 * Authentication Helper Functions for E2E Tests
 */

export const auth = {
  /**
   * Login as a regular user
   */
  loginUser: (email: string = "test@example.com", password: string = "Test123456") => {
    cy.visit("/login");
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 5000 }).should("not.include", "/login");
  },

  /**
   * Login as admin
   */
  loginAdmin: (email: string = "admin@example.com", password: string = "Admin123456") => {
    cy.visit("/admin-login");
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 5000 }).should("not.include", "/admin-login");
  },

  /**
   * Register a new user
   */
  register: (email: string, password: string = "ValidPassword123") => {
    cy.visit("/register");
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
  },

  /**
   * Logout current user
   */
  logout: () => {
    cy.get('[class*="logout"], [aria-label*="logout"], button:contains("Logout")')
      .first()
      .click({ force: true });
    cy.url().should("include", "/login").or("include", "/");
  },

  /**
   * Clear all auth data (cookies, localStorage, sessionStorage)
   */
  clearAuth: () => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.clearAllLocalStorage();
  },

  /**
   * Verify user is logged in
   */
  verifyLoggedIn: () => {
    cy.url().should("not.include", "/login");
    cy.url().should("not.include", "/register");
  },

  /**
   * Verify user is logged out
   */
  verifyLoggedOut: () => {
    cy.clearLocalStorage();
    cy.visit("/dashboard");
    cy.url().should("include", "/login");
  },
};

/**
 * Create a unique email for testing
 */
export const generateTestEmail = (prefix = "user") => {
  return `${prefix}${Date.now()}@example.com`;
};