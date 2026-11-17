import React from "react";
import { vi } from "vitest";

import { reseed } from "@excalidraw/common";

import { reconcileElements } from "../data/reconcile";
import { Excalidraw } from "../index";
import * as StaticScene from "../renderer/staticScene";
import { render, queryByTestId, unmountComponent } from "../tests/test-utils";

const renderStaticScene = vi.spyOn(StaticScene, "renderStaticScene");

describe("Test <App/>", () => {
  beforeEach(async () => {
    unmountComponent();
    localStorage.clear();
    renderStaticScene.mockClear();
    reseed(7);
  });

  it("should show error modal when using brave and measureText API is not working", async () => {
    (global.navigator as any).brave = {
      isBrave: {
        name: "isBrave",
      },
    };

    const originalContext = global.HTMLCanvasElement.prototype.getContext("2d");
    //@ts-ignore
    global.HTMLCanvasElement.prototype.getContext = (contextId) => {
      return {
        ...originalContext,
        measureText: () => ({
          width: 0,
        }),
      };
    };

    await render(<Excalidraw />);
    expect(
      queryByTestId(
        document.querySelector(".excalidraw-modal-container")!,
        "brave-measure-text-error",
      ),
    ).toMatchSnapshot();
  });

  it("preserves remote edits after repeated updateScene index healing", async () => {
    await render(<Excalidraw />);

    const api = window.h.app.api;

    const remoteRect = (version: number) =>
      ({
        id: "rect-1",
        type: "rectangle",
        x: 100,
        y: 100,
        width: 200,
        height: 120,
        angle: 0,
        strokeColor: "#1e1e1e",
        backgroundColor: "transparent",
        fillStyle: "solid",
        strokeWidth: 2,
        strokeStyle: "solid",
        roughness: 1,
        opacity: 100,
        groupIds: [],
        frameId: null,
        roundness: null,
        seed: 1,
        versionNonce: 777,
        isDeleted: false,
        boundElements: null,
        updated: 1,
        link: null,
        locked: false,
        version,
      }) as any;

    React.act(() => {
      api.updateScene({ elements: [remoteRect(10)] });
    });

    let local = api.getSceneElements().find(
      (element) => element.id === "rect-1",
    )!;

    for (let round = 1; round <= 2; round++) {
      React.act(() => {
        api.updateScene({
          elements: [{ ...local, index: undefined }],
        });
      });

      local = api.getSceneElements().find(
        (element) => element.id === "rect-1",
      )!;
    }

    const remoteEdit = {
      ...remoteRect(11),
      x: 400,
      y: 300,
    };

    const reconciled = reconcileElements(
      api.getSceneElements(),
      [remoteEdit],
      api.getAppState(),
    );

    const winner = reconciled.find(
      (element) => element.id === "rect-1",
    );

    expect(local.version).toBe(10);
    expect(local.versionNonce).toBe(777);
    expect(winner?.x).toBe(400);
    expect(winner?.y).toBe(300);
  });
});
