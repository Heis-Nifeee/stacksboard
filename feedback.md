# StacksBoard — Project Feedback

## Overview

StacksBoard is a lightweight public guestbook built on Stacks. It lets anyone connect a testnet wallet, publish a short message, and view recent entries from an on-chain feed.

The project demonstrates a clear end-to-end dApp flow: a Clarity smart contract manages permanent guestbook data, while a custom Next.js interface handles wallet connection, message submission, transaction feedback, and feed rendering.

## What works well

- The contract has a focused scope: publish a message, retain its author and block height, and retrieve entries by ID.
- Message length is constrained to 140 UTF-8 characters, with empty submissions rejected on-chain.
- The interface makes transaction progress understandable with wallet, pending, confirmed, error, and Explorer states.
- The feed is optimized for the primary use case by showing the newest 20 entries first.
- Generated Scaffold Stacks bindings keep the frontend aligned with the contract ABI.

## Validation and deployment

- Clarity contract check completed successfully.
- Contract tests pass: 2/2.
- Frontend TypeScript check passes.
- The guestbook is confirmed on Stacks testnet at:
  `ST3QNG4ST4ETTDEXPM19F9THRGKG1P2EN4DZCS6HM.guestbook`
- Deployment transaction:
  [`0x23ccc6d26869971777c3b479ee94be519d2219ddaf8a733d99f18565bc2eceb9`](https://explorer.hiro.so/txid/0x23ccc6d26869971777c3b479ee94be519d2219ddaf8a733d99f18565bc2eceb9?chain=testnet)

## Suggested next steps

1. Complete a browser smoke test with a testnet wallet: connect, publish a message, and confirm it appears in the feed.
2. Add pagination or a “load more” control when the guestbook grows beyond the latest 20 messages.
3. Add contract tests for the 140-character boundary and message retrieval by ID.
4. Add a CI workflow that runs the contract tests and frontend type-check on every pull request.
5. Keep testnet and mainnet deployer mnemonics out of Git at all times.

## Release readiness

The project is ready to be pushed to GitHub as a testnet dApp. Before a mainnet release, complete the browser smoke test, review the contract independently, and use a dedicated, securely stored deployer account.
