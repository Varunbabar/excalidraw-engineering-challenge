import { reconcileElements } from "../../data/reconcile";
import type { RemoteExcalidrawElement } from "../../data/reconcile";
import type { OrderedExcalidrawElement } from "@excalidraw/element/types";
import type { AppState } from "../../types";

describe("reconciliation investigation", () => {
  it("checks convergence for equal version and nonce but different content", () => {
    const local = [
      { id: "A", version: 5, versionNonce: 100, index: "a0", x: 50 },
    ] as unknown as OrderedExcalidrawElement[];

    const remote = [
      { id: "A", version: 5, versionNonce: 100, index: "a0", x: 200 },
    ] as unknown as RemoteExcalidrawElement[];

    const appState = {} as AppState;

    const resultA = reconcileElements(local, remote, appState);

    const resultB = reconcileElements(
      remote as unknown as OrderedExcalidrawElement[],
      local as unknown as RemoteExcalidrawElement[],
      appState,
    );

    console.log("Client A result:", resultA[0].x);
    console.log("Client B result:", resultB[0].x);

    expect(resultA[0].x).not.toEqual(resultB[0].x);
  });
  it("converges when versions are equal but nonces differ", () => {
  const local = [
    { id: "A", version: 5, versionNonce: 100, index: "a0", x: 50 },
  ] as unknown as OrderedExcalidrawElement[];

  const remote = [
    { id: "A", version: 5, versionNonce: 200, index: "a0", x: 200 },
  ] as unknown as RemoteExcalidrawElement[];

  const appState = {} as AppState;

  const resultA = reconcileElements(local, remote, appState);

  const resultB = reconcileElements(
    remote as unknown as OrderedExcalidrawElement[],
    local as unknown as RemoteExcalidrawElement[],
    appState,
  );

  console.log("Client A result:", resultA[0].x);
  console.log("Client B result:", resultB[0].x);

  expect(resultA[0].x).toBe(50);
  expect(resultB[0].x).toBe(50);
});
});