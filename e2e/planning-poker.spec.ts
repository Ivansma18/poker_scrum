import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
});

test("creates a room, votes, reveals results, and resets the round", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Create a room" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Create room" })).toBeDisabled();

  await page.getByLabel("Room name").fill("Sprint planning");
  await page.getByLabel("Your name").fill("Ada");
  await page.getByRole("button", { name: "Create room" }).click();

  await expect(
    page.getByRole("heading", { name: "Sprint planning" }),
  ).toBeVisible();
  await expect(page.getByText("Room: SPRINT")).toBeVisible();
  await expect(page.getByText("Role: facilitator")).toBeVisible();

  await page.getByLabel("Story name or ID").fill("PROJ-123 Login flow");
  await page.getByRole("button", { name: "Apply story" }).click();
  await expect(page.getByText("PROJ-123 Login flow")).toBeVisible();

  await page.getByRole("button", { name: "5", exact: true }).click();
  await expect(page.getByText("Your vote: 5")).toBeVisible();
  await expect(page.getByText("Voted")).toBeVisible();

  await page.getByRole("button", { name: "Reveal votes" }).click();
  await expect(
    page.getByRole("heading", { name: "Results summary" }),
  ).toBeVisible();
  await expect(page.getByText("Based on 1 revealed vote")).toBeVisible();
  await expect(page.getByText("Majority")).toBeVisible();
  await expect(page.getByText("Average")).toBeVisible();

  await page.getByRole("button", { name: "Reset round" }).click();
  await expect(page.getByText("Your vote: none")).toBeVisible();
  await expect(page.getByText("Waiting")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Results summary" }),
  ).toBeHidden();
});

test("joins from an invite link as a spectator without voting permissions", async ({
  page,
}) => {
  await page.goto("/?room=OBS");

  await expect(page.getByRole("heading", { name: "Join a room" })).toBeVisible();
  await expect(page.getByLabel("Room code")).toHaveValue("OBS");

  await page.getByRole("button", { name: "Spectator" }).click();
  await page.getByLabel("Your name").fill("Grace");
  await page.getByRole("button", { name: "Join as spectator" }).click();

  await expect(page.getByText("Room: OBS")).toBeVisible();
  await expect(page.getByText("Role: spectator")).toBeVisible();
  await expect(
    page.getByText("You are observing this session and cannot submit votes."),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "5", exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Reveal votes" })).toBeDisabled();
});

test("confirms leaving a room and returns to the entry form", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Room name").fill("Exit room");
  await page.getByLabel("Your name").fill("Linus");
  await page.getByRole("button", { name: "Create room" }).click();

  await expect(page.getByRole("heading", { name: "Exit room" })).toBeVisible();
  await page.getByRole("button", { name: "Leave room" }).click();

  await expect(page.getByRole("dialog", { name: "Leave room?" })).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByRole("heading", { name: "Exit room" })).toBeVisible();

  await page.getByRole("button", { name: "Leave room" }).click();
  await page.getByRole("button", { name: "Leave room" }).last().click();

  await expect(
    page.getByRole("heading", { name: "Create a room" }),
  ).toBeVisible();
});
