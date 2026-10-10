const test = require("node:test");
const assert = require("node:assert");

const API_URL = process.env.API_URL || "http://localhost:5000/api";

async function request(method, path, { token, body } = {}) {
  const headers = {};
  if (body) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  return { status: response.status, data };
}

const runId = Date.now();
const userA = { name: "Test User A", email: `user-a-${runId}@example.com`, password: "password123" };
const userB = { name: "Test User B", email: `user-b-${runId}@example.com`, password: "password123" };
let tokenA;
let tokenB;

test("registration rejects invalid input", async () => {
  const { status, data } = await request("POST", "/auth/register", {
    body: { name: "", email: "not-an-email", password: "123" },
  });
  assert.strictEqual(status, 400);
  assert.ok(data.errors.name);
  assert.ok(data.errors.email);
  assert.ok(data.errors.password);
});

test("registration creates users and never returns the password", async () => {
  for (const user of [userA, userB]) {
    const { status, data } = await request("POST", "/auth/register", { body: user });
    assert.strictEqual(status, 201);
    assert.strictEqual(data.user.email, user.email);
    assert.strictEqual(data.user.password_hash, undefined);
  }
});

test("registering the same email twice is rejected", async () => {
  const { status, data } = await request("POST", "/auth/register", { body: userA });
  assert.strictEqual(status, 409);
  assert.ok(data.errors.email);
});

test("login fails with a wrong password", async () => {
  const { status } = await request("POST", "/auth/login", {
    body: { email: userA.email, password: "wrong-password" },
  });
  assert.strictEqual(status, 401);
});

test("login returns a token", async () => {
  const loginA = await request("POST", "/auth/login", {
    body: { email: userA.email, password: userA.password },
  });
  assert.strictEqual(loginA.status, 200);
  assert.ok(loginA.data.token);
  tokenA = loginA.data.token;

  const loginB = await request("POST", "/auth/login", {
    body: { email: userB.email, password: userB.password },
  });
  tokenB = loginB.data.token;
});

test("/auth/me needs a valid token", async () => {
  const noToken = await request("GET", "/auth/me");
  assert.strictEqual(noToken.status, 401);

  const badToken = await request("GET", "/auth/me", { token: "not-a-real-token" });
  assert.strictEqual(badToken.status, 401);

  const goodToken = await request("GET", "/auth/me", { token: tokenA });
  assert.strictEqual(goodToken.status, 200);
  assert.strictEqual(goodToken.data.user.email, userA.email);
});

test("templates list returns at least six templates", async () => {
  const { status, data } = await request("GET", "/templates");
  assert.strictEqual(status, 200);
  assert.ok(data.length >= 6);
  assert.ok(Array.isArray(data[0].features));
});

test("search and category filters work alone and together", async () => {
  const blogs = await request("GET", "/templates?category=Blogs");
  assert.ok(blogs.data.length >= 1);
  assert.ok(blogs.data.every((template) => template.category === "Blogs"));

  const search = await request("GET", "/templates?search=dashboard");
  assert.ok(search.data.some((template) => template.name === "SaaS Dashboard"));

  const both = await request("GET", "/templates?search=dashboard&category=Blogs");
  assert.strictEqual(both.data.length, 0);
});

test("template details handles valid, invalid and missing ids", async () => {
  const found = await request("GET", "/templates/1");
  assert.strictEqual(found.status, 200);
  assert.strictEqual(found.data.id, 1);

  const invalid = await request("GET", "/templates/abc");
  assert.strictEqual(invalid.status, 400);

  const missing = await request("GET", "/templates/9999");
  assert.strictEqual(missing.status, 404);
});

test("favorites need a login", async () => {
  const { status } = await request("GET", "/favorites");
  assert.strictEqual(status, 401);
});

test("favorites start empty", async () => {
  const { status, data } = await request("GET", "/favorites", { token: tokenA });
  assert.strictEqual(status, 200);
  assert.deepStrictEqual(data, []);
});

test("adding a favorite works, duplicates and unknown templates are rejected", async () => {
  const added = await request("POST", "/favorites/1", { token: tokenA });
  assert.strictEqual(added.status, 201);

  const duplicate = await request("POST", "/favorites/1", { token: tokenA });
  assert.strictEqual(duplicate.status, 409);

  const unknown = await request("POST", "/favorites/9999", { token: tokenA });
  assert.strictEqual(unknown.status, 404);

  const invalid = await request("POST", "/favorites/abc", { token: tokenA });
  assert.strictEqual(invalid.status, 400);
});

test("each user only sees their own favorites", async () => {
  const mine = await request("GET", "/favorites", { token: tokenA });
  assert.strictEqual(mine.data.length, 1);
  assert.strictEqual(mine.data[0].id, 1);

  const theirs = await request("GET", "/favorites", { token: tokenB });
  assert.deepStrictEqual(theirs.data, []);
});

test("a user cannot remove another user's favorite", async () => {
  const { status } = await request("DELETE", "/favorites/1", { token: tokenB });
  assert.strictEqual(status, 404);

  const mine = await request("GET", "/favorites", { token: tokenA });
  assert.strictEqual(mine.data.length, 1);
});

test("removing a favorite works once, then it is gone", async () => {
  const removed = await request("DELETE", "/favorites/1", { token: tokenA });
  assert.strictEqual(removed.status, 200);

  const removedAgain = await request("DELETE", "/favorites/1", { token: tokenA });
  assert.strictEqual(removedAgain.status, 404);

  const mine = await request("GET", "/favorites", { token: tokenA });
  assert.deepStrictEqual(mine.data, []);
});
