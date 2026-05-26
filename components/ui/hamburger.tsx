import { Menu } from "lucide-react";

type HamburgerProps = {
  setMobileOpen: () => void;
};

export function Hamburger({ setMobileOpen }: HamburgerProps) {
  return (
    <div className="flex items-center gap-2 md:hidden">
      <button
        type="button"
        onClick={setMobileOpen}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>
    </div>
  );
}
