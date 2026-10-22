"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Cl } from "@stacks/transactions";
import { useAtomValue } from "jotai";
import { addressAtom } from "@/store/wallet";
import { guestbook_getMessage } from "@/generated/contracts";
import { useGuestbook_GetMessageCount, useGuestbook_Post } from "@/generated/hooks";

const MAX_LENGTH = 140;
type Message = { id: bigint; author: string; body: string; createdAt: bigint };
const short = (address: string) => `${address.slice(0, 5)}…${address.slice(-4)}`;
const unwrap = (raw: unknown): unknown => raw && typeof raw === "object" && "ok" in raw ? (raw as { ok: boolean; value: unknown }).value : raw;

export function Guestbook() {
  const address = useAtomValue(addressAtom);
  const [body, setBody] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);
  const count = useGuestbook_GetMessageCount();
  const post = useGuestbook_Post();
  const refresh = useCallback(async () => {
    setLoadingFeed(true); setFeedError(null);
    try {
      const total = unwrap(await count.call([]));
      if (typeof total !== "bigint") { setMessages([]); return; }
      const size = Number(total > 20n ? 20n : total);
      const rows = await Promise.all(Array.from({ length: size }, async (_, i) => {
        const id = total - BigInt(i);
        const raw = unwrap(await guestbook_getMessage([Cl.uint(id)]));
        if (!raw || typeof raw !== "object") return null;
        const value = raw as Record<string, unknown>;
        return typeof value.author === "string" && typeof value.body === "string"
          ? { id, author: value.author, body: value.body, createdAt: typeof value["created-at"] === "bigint" ? value["created-at"] : 0n } : null;
      }));
      setMessages(rows.filter((row): row is Message => row !== null));
    } catch (error) { setFeedError(error instanceof Error ? error.message : "Could not load the board."); }
    finally { setLoadingFeed(false); }
  }, [count.call]);
  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => { if (post.txStatus === "success") { setBody(""); void refresh(); } }, [post.txStatus, refresh]);
  const canPost = Boolean(address) && body.trim().length > 0 && !post.loading;
  async function submit(event: FormEvent) { event.preventDefault(); if (canPost) try { await post.call([Cl.stringUtf8(body.trim())]); } catch {} }
  const status = post.loading ? "Opening wallet…" : post.txStatus === "pending" ? "Broadcast sent — awaiting confirmation" : post.txStatus === "success" ? "Posted to StacksBoard" : post.txStatusError;
  return <main className="mx-auto min-h-[calc(100vh-154px)] max-w-5xl px-5 pb-16 pt-12 sm:px-8 sm:pt-20">
    <section className="mb-12 max-w-3xl"><p className="mb-4 font-mono text-xs uppercase tracking-[.24em] text-orange-300">Stacks testnet · public guestbook</p><h1 className="text-5xl font-semibold tracking-[-.06em] text-stone-50 sm:text-7xl">Leave a mark on the chain.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-stone-400">A tiny public square for the Stacks community. Every note is permanent, signed, and yours.</p></section>
    <section className="rounded-[2rem] border border-white/10 bg-white/[.045] p-5 shadow-2xl shadow-black/20 sm:p-7"><div className="mb-5 flex items-center justify-between gap-4"><div><h2 className="text-xl font-medium">Write a message</h2><p className="mt-1 text-sm text-stone-500">140 characters. Stored in the guestbook contract.</p></div><span className="font-mono text-sm text-stone-500">{MAX_LENGTH - body.length}</span></div><form onSubmit={submit}><textarea value={body} onChange={e => setBody(e.target.value.slice(0, MAX_LENGTH))} disabled={!address || post.loading} placeholder={address ? "What’s on your mind?" : "Connect a wallet to write…"} className="min-h-32 w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-4 text-base leading-7 outline-none placeholder:text-stone-600 focus:border-orange-300/60 disabled:cursor-not-allowed disabled:opacity-60" /><div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="min-h-5 text-sm text-stone-500">{!address ? "Connect your testnet wallet to post." : status}{post.error && <span className="text-red-300"> {post.error.message}</span>}</p><button disabled={!canPost} className="rounded-full bg-orange-300 px-5 py-3 font-medium text-stone-950 transition hover:bg-orange-200 disabled:cursor-not-allowed disabled:bg-stone-700 disabled:text-stone-400">{post.loading ? "Opening wallet…" : post.txStatus === "pending" ? "Confirming…" : post.txStatus === "success" ? "Posted ✓" : "Post message"}</button></div>{post.explorerUrl && <a className="mt-4 inline-block text-sm text-orange-300 underline underline-offset-4" href={post.explorerUrl} target="_blank" rel="noreferrer">View transaction in Explorer ↗</a>}</form></section>
    <section className="mt-14"><div className="mb-6 flex items-end justify-between"><div><p className="font-mono text-xs uppercase tracking-[.2em] text-stone-500">The board</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.04em]">Fresh from the chain</h2></div><button onClick={() => void refresh()} className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-300 transition hover:border-white/30">Refresh</button></div>{loadingFeed ? <p className="py-10 text-stone-500">Loading on-chain messages…</p> : feedError ? <p className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5 text-red-200">{feedError}</p> : messages.length === 0 ? <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-stone-500">No messages yet. Be the first to sign the board.</div> : <div className="space-y-3">{messages.map(item => <article key={item.id.toString()} className="rounded-2xl border border-white/[.08] bg-white/[.025] p-5 transition hover:border-white/20"><div className="mb-3 flex items-center justify-between"><span className="rounded-full bg-orange-300/10 px-3 py-1 font-mono text-xs text-orange-200">{short(item.author)}</span><span className="font-mono text-xs text-stone-600">#{item.id.toString()} · block {item.createdAt.toString()}</span></div><p className="whitespace-pre-wrap break-words text-[17px] leading-7 text-stone-200">{item.body}</p></article>)}</div>}</section>
  </main>;
}
