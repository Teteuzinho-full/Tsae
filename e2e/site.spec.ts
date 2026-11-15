import { test, expect } from "@playwright/test";

test("Consultoria vem primeiro e usa o ícone/logo da TSAE", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", "/assets/logo.ico");
  await expect(page.getByRole("heading", { name: /Áreas de atuação/ })).toBeVisible();
});
test("Educa troca logo e ícone", async ({ page }) => {
  await page.goto("/educa");
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", "/assets/logo-educa.ico");
  await expect(page.getByAltText("TSAE Educa").first()).toBeVisible();
});
test("áreas privadas exigem login", async ({ page }) => {
  for (const [from, to] of [["/admin", /admin\/login/], ["/aluno", /aluno\/login/]] as const) { await page.goto(from); await expect(page).toHaveURL(to); }
});
test("contato recusa envio sem consentimento", async ({ page }) => {
  await page.goto("/#contato");
  await page.getByPlaceholder("Nome").fill("Ana Silva");
  await page.getByPlaceholder("E-mail").fill("ana@exemplo.com");
  await page.getByPlaceholder("Como podemos ajudar?").fill("Preciso de orientação sobre SIF.");
  await page.getByRole("button", { name: "Enviar" }).click();
  await expect(page.getByText("Mensagem enviada")).toHaveCount(0);
});
