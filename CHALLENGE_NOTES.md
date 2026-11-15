\# Excalidraw Engineering Challenge



\## Project Overview



This repository contains the Excalidraw open-source project, preserved with its original Git commit history, along with documentation of my local setup, testing, and engineering investigation.



\## Local Development Setup



\- Cloned the official Excalidraw repository.

\- Installed dependencies using Yarn.

\- Started the development application locally.

\- Verified the application in the browser.



\## Collaboration Server Setup



Excalidraw uses a separate collaboration server for real-time multi-user collaboration.



\- Repository: https://github.com/excalidraw/excalidraw-room

\- Installed dependencies using `corepack yarn install`.

\- Started the server using `corepack yarn start:dev`.

\- Verified the server response at `http://localhost:3002`.

\- Received HTTP 200 with the expected health-check message.



\## Collaboration Testing



Tested using two separate browser sessions:



1\. Created a collaboration room in the first session.

2\. Joined the same room in the second session.

3\. Verified participant presence.

4\. Verified real-time drawing synchronization between sessions.



\*\*Result:\*\* Live collaboration worked successfully after starting the local collaboration server.



\## Code Investigation



Inspected the following areas:



\- `Collab.tsx` — collaboration lifecycle and synchronization.

\- `Portal.tsx` — socket communication and broadcasting.

\- `reconcile.ts` — merging local and remote scene elements.

\- `errors.ts` — custom application error classes.



\## Findings



The initial collaboration test failed because the separate local collaboration server was not running.



After following the documented setup and starting `excalidraw-room`, collaboration worked successfully.



No confirmed application defect was established during this investigation.



\## Attribution



Original project: https://github.com/excalidraw/excalidraw



Collaboration server: https://github.com/excalidraw/excalidraw-room

