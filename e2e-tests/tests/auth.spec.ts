import { test, expect } from '@playwright/test';

const UI_URL = "http://localhost:5173/";

test('should allow the user to sign in', async ({ page }) => {
  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();
  
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  // finds the element with name email and password
  await page.locator("[name=email]").fill("1@1.com");
  await page.locator("[name=password]").fill("password");

  await page.getByRole("button", {name: "Login"}).click();

  // checks if user logged in
  await expect(page.getByText("Sign in Successful!")).toBeVisible();
  await expect(page.getByRole("link", {name: "My Bookings"})).toBeVisible();
  await expect(page.getByRole("link", {name: "My Hotels"})).toBeVisible();
  await expect(page.getByRole("button", {name: "Sign Out"})).toBeVisible();
});

test ("should allow the user to register", async ({page}) => {
  const testEmail = `test_register_${Math.floor(Math.random() * 90000) + 1000}@test.com`;
  await page.goto(UI_URL);

  // Get the sign in button
  await page.getByRole("link", { name: "Sign In"}).click();
  await page.getByRole("link", { name: "Create an account here"}).click();

  await expect(page.getByRole("heading", {name: "Create an Account"})).toBeVisible();

  // finds the element with name email and password
  await page.locator("[name=firstName]").fill("TestFirstName");
  await page.locator("[name=lastName]").fill("TestLastName");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("123456");
  await page.locator("[name=confirmPassword]").fill("123456");

  await page.getByRole("button", {name: "Create Account"}).click();

  // checks if Registered in
  await expect(page.getByText("Registration Success!")).toBeVisible();
  await expect(page.getByRole("link", {name: "My Bookings"})).toBeVisible();
  await expect(page.getByRole("link", {name: "My Hotels"})).toBeVisible();
  await expect(page.getByRole("button", {name: "Sign Out"})).toBeVisible();

})


