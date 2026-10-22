import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe("guestbook", () => {
  it("stores the message, author, and increasing id", () => {
    const post = simnet.callPublicFn(
      "guestbook",
      "post",
      [Cl.stringUtf8("Hello StacksBoard!")],
      wallet1,
    );
    expect(post.result).toBeOk(Cl.uint(1));

    const count = simnet.callReadOnlyFn("guestbook", "get-message-count", [], deployer);
    expect(count.result).toBeOk(Cl.uint(1));

    const message = simnet.callReadOnlyFn("guestbook", "get-message", [Cl.uint(1)], deployer);
    expect(message.result).toBeOk(
      Cl.some(
        Cl.tuple({
          author: Cl.standardPrincipal(wallet1),
          body: Cl.stringUtf8("Hello StacksBoard!"),
          "created-at": Cl.uint(3),
        }),
      ),
    );
  });

  it("rejects an empty message", () => {
    const { result } = simnet.callPublicFn("guestbook", "post", [Cl.stringUtf8("")], deployer);
    expect(result).toBeErr(Cl.uint(100));
  });
});
