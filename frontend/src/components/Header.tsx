import { WalletConnect } from './WalletConnect'
import NetworkBadge from './NetworkBadge'

function Header() {
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-5 pt-6 sm:px-8 sm:pt-8">
      <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-orange-300 font-mono text-lg font-bold text-stone-950">S</div><div><p className="text-lg font-semibold tracking-[-.04em]">StacksBoard</p><NetworkBadge /></div></div>
      <WalletConnect />
    </header>
  )
}

export default Header
