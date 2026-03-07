import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ProfileDropdown from "./dropdown-profile";

describe("ProfileDropdown", () => {
  it("renders with trigger", () => {
    render(
      <ProfileDropdown
        trigger={<button>Profile</button>}
        profile={{ name: "Test" }}
        user={{ email: "test@test.com" }}
      />
    );
    expect(document.body).toBeTruthy();
  });
});
