import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePagination } from "./use-pagination";

describe("usePagination", () => {
  it("returns pages when totalPages <= paginationItemsToDisplay", () => {
    const { result } = renderHook(() =>
      usePagination({ currentPage: 1, totalPages: 3, paginationItemsToDisplay: 5 })
    );
    expect(result.current.pages).toEqual([1, 2, 3]);
    expect(result.current.showLeftEllipsis).toBe(false);
    expect(result.current.showRightEllipsis).toBe(false);
  });

  it("returns paginated range when totalPages > display", () => {
    const { result } = renderHook(() =>
      usePagination({ currentPage: 5, totalPages: 10, paginationItemsToDisplay: 5 })
    );
    expect(result.current.pages.length).toBeLessThanOrEqual(5);
    expect(result.current.pages).toContain(5);
  });

  it("shows ellipsis when at start", () => {
    const { result } = renderHook(() =>
      usePagination({ currentPage: 1, totalPages: 10, paginationItemsToDisplay: 3 })
    );
    expect(result.current.showRightEllipsis).toBe(true);
  });

  it("shows ellipsis when at end", () => {
    const { result } = renderHook(() =>
      usePagination({ currentPage: 10, totalPages: 10, paginationItemsToDisplay: 3 })
    );
    expect(result.current.showLeftEllipsis).toBe(true);
  });
});
