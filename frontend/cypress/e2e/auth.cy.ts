describe("Authentication E2E Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("User Registration", () => {
    it("should navigate to register page", () => {
      cy.visit("/register");
      cy.contains("Create Account").should("be.visible");
    });

    it("should show validation error for invalid email", () => {
      cy.visit("/register");
      cy.get('input[type="email"]').type("invalid-email");
      cy.get('input[type="password"]').type("password123");
      cy.get('button[type="submit"]').click();
      cy.contains(/email|invalid/i).should("be.visible");
    });

    it("should show validation error for short password", () => {
      cy.visit("/register");
      cy.get('input[type="email"]').type("user@example.com");
      cy.get('input[type="password"]').type("123");
      cy.get('button[type="submit"]').click();
      cy.contains(/password|characters/i).should("be.visible");
    });

    it("should successfully register with valid credentials", () => {
      cy.visit("/register");
      const email = `user${Date.now()}@example.com`;

      cy.get('input[type="email"]').type(email);
      cy.get('input[type="password"]').type("ValidPassword123");
      cy.get('button[type="submit"]').click();

      // Should redirect to login or dashboard
      cy.url().should("include", "/login").or("include", "/dashboard");
    });
  });

  describe("User Login", () => {
    it("should navigate to login page", () => {
      cy.visit("/login");
      cy.contains("Login").should("be.visible");
    });

    it("should show error for invalid credentials", () => {
      cy.visit("/login");
      cy.get('input[type="email"]').type("wrong@example.com");
      cy.get('input[type="password"]').type("wrongpassword");
      cy.get('button[type="submit"]').click();

      // Error toast or message
      cy.contains(/incorrect|invalid|failed/i, { timeout: 5000 }).should("exist");
    });

    it("should require email field", () => {
      cy.visit("/login");
      cy.get('input[type="password"]').type("password123");
      cy.get('button[type="submit"]').click();

      cy.contains(/email|required/i).should("be.visible");
    });

    it("should require password field", () => {
      cy.visit("/login");
      cy.get('input[type="email"]').type("user@example.com");
      cy.get('button[type="submit"]').click();

      cy.contains(/password|required/i).should("be.visible");
    });

    it("should successfully login with valid credentials", () => {
      cy.visit("/login");
      cy.get('input[type="email"]').type("test@example.com");
      cy.get('input[type="password"]').type("Test123456");
      cy.get('button[type="submit"]').click();

      // Should redirect away from login page
      cy.url({ timeout: 5000 }).should("not.include", "/login");
    });

    it("should display loading state during login", () => {
      cy.visit("/login");
      cy.get('input[type="email"]').type("test@example.com");
      cy.get('input[type="password"]').type("Test123456");
      cy.get('button[type="submit"]').click();

      // Button should show loading state
      cy.get('button[type="submit"]').should("contain", /loading|processing/i).or("be.disabled");
    });
  });

  describe("Admin Login", () => {
    it("should navigate to admin login page", () => {
      cy.visit("/admin-login");
      cy.contains(/admin|login/i).should("be.visible");
    });

    it("should show error for invalid admin credentials", () => {
      cy.visit("/admin-login");
      cy.get('input[type="email"]').type("admin@example.com");
      cy.get('input[type="password"]').type("wrongpassword");
      cy.get('button[type="submit"]').click();

      cy.contains(/incorrect|invalid|failed/i, { timeout: 5000 }).should("exist");
    });

    it("should successfully login as admin", () => {
      cy.visit("/admin-login");
      cy.get('input[type="email"]').type("admin@example.com");
      cy.get('input[type="password"]').type("Admin123456");
      cy.get('button[type="submit"]').click();

      // Should redirect to admin dashboard
      cy.url({ timeout: 5000 }).should("not.include", "/admin-login");
    });
  });

  describe("Protected Routes", () => {
    it("should redirect unauthenticated user to login", () => {
      // Clear any auth data
      cy.clearLocalStorage();
      cy.visit("/dashboard");

      // Should redirect to login
      cy.url().should("include", "/login");
    });

    it("should allow authenticated user to access dashboard", () => {
      cy.visit("/login");
      cy.get('input[type="email"]').type("test@example.com");
      cy.get('input[type="password"]').type("Test123456");
      cy.get('button[type="submit"]').click();

      // Should be able to access dashboard
      cy.url({ timeout: 5000 }).should("not.include", "/login");
    });

    it("should prevent unauthorized access to admin routes", () => {
      cy.clearLocalStorage();
      cy.visit("/admin/dashboard");

      // Should redirect to admin login
      cy.url().should("include", "/admin-login");
    });
  });

  describe("Logout", () => {
    it("should logout user and redirect to login", () => {
      // Login first
      cy.visit("/login");
      cy.get('input[type="email"]').type("test@example.com");
      cy.get('input[type="password"]').type("Test123456");
      cy.get('button[type="submit"]').click();

      cy.url({ timeout: 5000 }).should("not.include", "/login");

      // Find and click logout button
      cy.get('[class*="logout"], [aria-label*="logout"], button:contains("Logout")')
        .first()
        .click({ force: true });

      // Should redirect to login or home
      cy.url().should("include", "/login").or("include", "/");
    });

    it("should clear user data after logout", () => {
      // Login
      cy.visit("/login");
      cy.get('input[type="email"]').type("test@example.com");
      cy.get('input[type="password"]').type("Test123456");
      cy.get('button[type="submit"]').click();

      cy.url({ timeout: 5000 }).should("not.include", "/login");

      // Logout
      cy.get('[class*="logout"], [aria-label*="logout"], button:contains("Logout")')
        .first()
        .click({ force: true });

      // Try to access protected route
      cy.visit("/dashboard");

      // Should be redirected to login (data cleared)
      cy.url().should("include", "/login");
    });
  });

  describe("Session Persistence", () => {
    it("should maintain session on page reload", () => {
      // Login
      cy.visit("/login");
      cy.get('input[type="email"]').type("test@example.com");
      cy.get('input[type="password"]').type("Test123456");
      cy.get('button[type="submit"]').click();

      cy.url({ timeout: 5000 }).should("not.include", "/login");

      // Reload page
      cy.reload();

      // Should still be logged in (not redirected to login)
      cy.url().should("not.include", "/login");
    });

    it("should handle expired session gracefully", () => {
      // Login
      cy.visit("/login");
      cy.get('input[type="email"]').type("test@example.com");
      cy.get('input[type="password"]').type("Test123456");
      cy.get('button[type="submit"]').click();

      cy.url({ timeout: 5000 }).should("not.include", "/login");

      // Clear auth token to simulate expired session
      cy.clearLocalStorage();

      // Try to access protected route
      cy.visit("/dashboard");

      // Should be redirected to login
      cy.url().should("include", "/login");
    });
  });

  describe("Form Behavior", () => {
    it("should enable submit button only when form is valid", () => {
      cy.visit("/login");

      // Initially disabled (empty form)
      cy.get('button[type="submit"]').should("be.disabled");

      // Email only
      cy.get('input[type="email"]').type("user@example.com");
      cy.get('button[type="submit"]').should("be.disabled");

      // Email and password
      cy.get('input[type="password"]').type("password123");
      cy.get('button[type="submit"]').should("not.be.disabled");
    });

    it("should clear form errors on input change", () => {
      cy.visit("/login");

      // Submit empty form
      cy.get('button[type="submit"]').click({ force: true });
      cy.contains(/email|required/i).should("be.visible");

      // Start typing
      cy.get('input[type="email"]').type("test@");

      // Error should remain (email still invalid)
      cy.contains(/email|invalid/i).should("be.visible");

      // Complete valid email
      cy.get('input[type="email"]').clear().type("test@example.com");

      // Email error should clear
      cy.contains("email").should("not.exist");
    });
  });
});