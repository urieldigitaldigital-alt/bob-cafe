import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenisInstance(lenis: Lenis | null) {
  instance = lenis;
}

const NAVBAR_OFFSET = -88;

/** Scrolls to an in-page anchor through Lenis so its internal scroll target
 * stays in sync — a native `scrollTo`/hash jump gets silently overridden by
 * Lenis's own animation loop on the next frame otherwise. */
export function scrollToHash(hash: string) {
  const target = document.querySelector(hash);
  if (!target) return;

  if (instance) {
    instance.scrollTo(target as HTMLElement, { offset: NAVBAR_OFFSET, duration: 1.4 });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + NAVBAR_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  }
}
