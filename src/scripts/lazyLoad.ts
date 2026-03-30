/**
 * Shared progressive lazy-reveal for post lists.
 *
 * Requires:
 *   - `.post-item` elements (some may have class `hidden`)
 *   - `#load-sentinel`  — div watched by IntersectionObserver
 *   - `#no-more-hint`   — (optional) shown once all posts are visible
 *
 * Usage in an Astro page:
 *   <script>import "@/scripts/lazyLoad";</script>
 */

const BATCH_SIZE = 10;

function setup() {
  const sentinel = document.querySelector<HTMLElement>("#load-sentinel");
  if (!sentinel) return;

  // Snapshot the post items once; use a cursor for O(1) reveals.
  const items = Array.from(
    document.querySelectorAll<HTMLElement>(".post-item")
  );
  let cursor = items.findIndex(i => i.classList.contains("hidden"));

  // All posts already visible — remove sentinel right away.
  if (cursor === -1) {
    sentinel.remove();
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      if (!entries[0].isIntersecting) return;

      const end = Math.min(cursor + BATCH_SIZE, items.length);
      for (let i = cursor; i < end; i++) {
        items[i].classList.remove("hidden");
        items[i].classList.add("post-reveal"); // triggers fade-in
      }
      cursor = end;

      if (cursor >= items.length) {
        sentinel.remove();
        document.querySelector("#no-more-hint")?.classList.remove("hidden");
        observer.disconnect();
      }
    },
    { rootMargin: "300px" }
  );

  observer.observe(sentinel);
}

// Run on initial load and re-run after every Astro view transition.
setup();
document.addEventListener("astro:after-swap", setup);
