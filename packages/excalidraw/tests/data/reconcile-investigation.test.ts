
import { reconcileElements } from "../../data/reconcile";
import { restoreElements } from "../../data/restore";
import type { RemoteExcalidrawElement } from "../../data/reconcile";
import type { OrderedExcalidrawElement } from "@excalidraw/element/types";
import type { AppState } from "../../types";
import { Scene, syncInvalidIndices } from "@excalidraw/element";

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

    expect(resultA[0].x).toBe(50);
    expect(resultB[0].x).toBe(50);
  });

  it("checks whether repeated index repair artificially increases version", () => {
    const element = {
      id: "A",
      version: 10,
      versionNonce: 777,
      index: undefined,
    } as any;

    const elements = [element];

    syncInvalidIndices(elements);
    const firstVersion = element.version;

    element.index = undefined;
    syncInvalidIndices(elements);

    expect(element.version).toBe(firstVersion);
    expect(element.version).toBe(10);
  });

  it("checks whether artificial version inflation discards a genuine remote edit", () => {
    const local = {
      id: "A",
      version: 10,
      versionNonce: 777,
      index: undefined,
      x: 100,
    } as any;

    syncInvalidIndices([local]);
    local.index = undefined;
    syncInvalidIndices([local]);

    const remote = {
      id: "A",
      version: 11,
      versionNonce: 888,
      index: "a0",
      x: 400,
    } as any;

    const result = reconcileElements(
      [local] as unknown as OrderedExcalidrawElement[],
      [remote] as unknown as RemoteExcalidrawElement[],
      {} as AppState,
    );

    expect(local.version).toBe(10);
    expect(result[0].x).toBe(400);
  });

  it("checks whether Scene index repair can discard a genuine remote edit", () => {
    const local = {
      id: "A",
      version: 10,
      versionNonce: 777,
      index: undefined,
      x: 100,
    } as any;

    const scene = new Scene();

    scene.replaceAllElements([local], { skipValidation: true });

    local.index = undefined;

    scene.replaceAllElements([local], { skipValidation: true });

    const remote = {
      id: "A",
      version: 11,
      versionNonce: 888,
      index: "a0",
      x: 400,
    } as any;

    const result = reconcileElements(
      [local] as unknown as OrderedExcalidrawElement[],
      [remote] as unknown as RemoteExcalidrawElement[],
      {} as AppState,
    );

    expect(local.version).toBe(10);
    expect(result[0].x).toBe(400);
  });

  it("checks whether restoreElements increases version during index repair", () => {
    const remote = {
      id: "A",
      type: "rectangle",
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      angle: 0,
      version: 10,
      versionNonce: 777,
      index: undefined,
    } as any;

    const restored = restoreElements([remote], null);

    expect(restored[0].index).toBeDefined();
    expect(restored[0].version).toBe(10);
  });

  it("investigates remote edit loss after restoration and reconciliation", () => {
    const local = {
      id: "A",
      type: "rectangle",
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      angle: 0,
      version: 10,
      versionNonce: 777,
      index: "a0",
    } as any;

    const incomingRemote = {
      ...local,
      x: 400,
      version: 11,
      versionNonce: 888,
      index: undefined,
    };

    const restoredRemote = restoreElements([incomingRemote], null);

    const result = reconcileElements(
      [local] as unknown as OrderedExcalidrawElement[],
      restoredRemote as unknown as RemoteExcalidrawElement[],
      {} as AppState,
    );

    expect(restoredRemote[0].version).toBe(11);
    expect(result[0].x).toBe(400);
  });

  it("checks whether restoration version inflation discards the next remote edit", () => {
    const initialRemote = {
      id: "A",
      type: "rectangle",
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      angle: 0,
      version: 10,
      versionNonce: 777,
      index: undefined,
    } as any;

    const firstRestored = restoreElements([initialRemote], null);

    const local = firstRestored as unknown as OrderedExcalidrawElement[];

    const nextRemote = {
      ...firstRestored[0],
      x: 400,
      version: firstRestored[0].version,
      versionNonce: firstRestored[0].versionNonce + 1,
      index: "a0",
    };

    const result = reconcileElements(
      local,
      [nextRemote] as unknown as RemoteExcalidrawElement[],
      {} as AppState,
    );

    expect(result[0].x).toBe(100);
  });
});
