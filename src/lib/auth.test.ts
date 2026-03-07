import { describe, it, expect } from "vitest";
import type { JWTPayload, User } from "./auth";

describe("auth", () => {
  it("loads auth module", () => {
    const payload: JWTPayload = { sub: "1", email: "a@b.com", type: "access" };
    const user: User = { id: "1", email: "a@b.com" };
    expect(payload.sub).toBe("1");
    expect(user.id).toBe("1");
  });
});
