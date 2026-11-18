# Excalidraw – Engineering Challenge Contribution

A contribution to [Excalidraw](https://github.com/excalidraw/excalidraw), an open-source virtual whiteboard for sketching hand-drawn-like diagrams.

This repository contains my engineering challenge work, focused on investigating and fixing an issue in Excalidraw's scene-update and fractional-index handling logic.

## Project Overview

**Excalidraw** is an open-source, collaborative whiteboard application that allows users to create diagrams, sketches, and visual explanations with a hand-drawn appearance.

The codebase uses TypeScript and React, with functionality for:
- Creating and editing visual elements.
- Managing scene data and element states.
- Collaborative editing and remote scene updates.
- Synchronizing changes between users.
- Maintaining element ordering through fractional indices.

**Original repository:** https://github.com/excalidraw/excalidraw

## My Contribution

### Issue #11933 – Preserve Remote Element Versions During Fractional-Index Healing

**Problem**

When `updateScene` received remote elements with invalid or missing fractional indices, the index-healing process could modify their version-related properties.

This caused an unintended version increment during remote scene updates.

As a result, `reconcileElements` could incorrectly discard genuine remote edits because the element-version comparison no longer reflected the original remote update.

**My Objective**

Fix the version-preservation issue without changing the existing behavior for normal local element updates.

### Solution Implemented

I worked on the scene replacement and fractional-index synchronization logic.

The changes include:

1. Updated `App.updateScene` to enable version preservation for updates using `CaptureUpdateAction.NEVER`.
2. Updated `Scene.replaceAllElements` to pass the version-preservation option into fractional-index synchronization.
3. Updated `syncInvalidIndices` to preserve:
   - `version`
   - `versionNonce`
   - `updated`
4. Retained the existing version-incrementing behavior when preservation is not requested.
5. Added a regression test covering repeated index healing and remote edit reconciliation.

### Files Modified

| File | Contribution |
|---|---|
| `packages/excalidraw/components/App.tsx` | Passes version-preservation behavior for remote scene updates |
| `packages/element/src/Scene.ts` | Forwards preservation options during scene replacement |
| `packages/element/src/fractionalIndex.ts` | Preserves element version properties during index healing |
| `packages/excalidraw/tests/App.test.tsx` | Adds regression coverage for remote edit reconciliation |

## Testing and Validation

The following test suites were used:

**Fractional-index tests**
```bash
corepack yarn test:app packages/element/tests/fractionalIndex.test.ts --run
```

Previously verified: 54 tests passed.

**App regression tests**
```bash
corepack yarn test:app packages/excalidraw/tests/App.test.tsx --run
```

Latest verified result: 2 tests passed.

The regression test checks that:
- Remote element versions remain unchanged during repeated index healing.
- The original `versionNonce` is preserved.
- A newer remote edit is correctly accepted during reconciliation.

## Technology Stack

- TypeScript
- React
- Yarn
- Vitest
- Git and GitHub
- Fractional indexing
- Collaborative scene synchronization

## GitHub Contribution Details

**Contribution branch:**
```text
fix/remote-update-scene-version-preservation
```

**Commit:**
```text
90c230ffb
```

**Commit message:**
```text
fix: preserve remote element versions during index healing
```

**Pull request target:** `excalidraw/excalidraw` → `master`

## What I Learned

Through this engineering challenge, I gained practical experience with:

- Navigating and understanding an existing large TypeScript codebase.
- Tracing bugs across application, scene, and element-management layers.
- Understanding version-based conflict resolution.
- Working with fractional indexing and element synchronization.
- Writing regression tests for collaborative application behavior.
- Using Git branches, commits, and GitHub forks to manage open-source contributions.

## Acknowledgements

Thanks to the Excalidraw maintainers and open-source community for providing an opportunity to explore and contribute to a real-world collaborative application.

---

**Author:** Varun

**Repository:** [Excalidraw Engineering Challenge](https://github.com/Varunbabar/excalidraw-engineering-challenge)

**Original Project:** [Excalidraw](https://github.com/excalidraw/excalidraw)