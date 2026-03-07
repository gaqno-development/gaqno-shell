import { describe, it, expect } from "vitest";
import type { JWTPayload, User } from "./dashboard.types";

describe("dashboard.types", () => {
  it("JWTPayload has expected shape", () => {
    const payload: JWTPayload = {
      sub: "user-1",
      email: "a@b.com",
      type: "access",
    };
    expect(payload.sub).toBe("user-1");
    expect(payload.email).toBe("a@b.com");
    expect(payload.type).toBe("access");
  });

  it("User has expected shape", () => {
    const user: User = {
      id: "1",
      email: "u@e.com",
    };
    expect(user.id).toBe("1");
    expect(user.email).toBe("u@e.com");
  });
});
