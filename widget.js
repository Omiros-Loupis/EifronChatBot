/**
 * Eifron Support Chat Widget
 * 
 * Προσθέστε αυτό στο site σας:
 * <script src="https://YOUR-SERVER.com/widget.js"></script>
 * 
 * Ή με custom ρυθμίσεις:
 * <script>
 *   window.EIFRON_CHAT_CONFIG = { position: "right", color: "#0d6e3f" };
 * </script>
 * <script src="https://YOUR-SERVER.com/widget.js"></script>
 */
(function () {
  "use strict";

  const CFG = Object.assign(
    {
      position: "right",       // "right" ή "left"
      color: "#0d6e3f",
      title: "Eifron Υποστήριξη",
      subtitle: "Αντλία S9 · EasyPatch · CGM",
      greeting: "Γεια σας! 👋 Πώς μπορώ να σας βοηθήσω;",
      // Auto-detect API URL: ίδιο origin αν σερβίρεται από Flask, αλλιώς fallback
      apiUrl: "",
    },
    window.EIFRON_CHAT_CONFIG || {}
  );

  // Detect API base
  const scriptTag = document.currentScript;
  if (!CFG.apiUrl && scriptTag) {
    const src = scriptTag.src;
    CFG.apiUrl = src.substring(0, src.lastIndexOf("/"));
  }
  if (!CFG.apiUrl) CFG.apiUrl = window.location.origin;

  // ── Inject CSS ──
  const style = document.createElement("style");
  style.textContent = `
    #eifron-chat-toggle {
      position: fixed;
      bottom: 24px;
      ${CFG.position}: 24px;
      width: 60px; height: 60px;
      border-radius: 50%;
      background: ${CFG.color};
      color: #fff;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,.25);
      z-index: 99999;
      font-size: 28px;
      display: flex; align-items: center; justify-content: center;
      transition: transform .2s, box-shadow .2s;
    }
    #eifron-chat-toggle:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(0,0,0,.3);
    }
    #eifron-chat-toggle .badge {
      position: absolute; top: -2px; right: -2px;
      width: 18px; height: 18px; border-radius: 50%;
      background: #e74c3c; font-size: 11px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }
    #eifron-chat-frame {
      position: fixed;
      bottom: 100px;
      ${CFG.position}: 24px;
      width: 400px; max-width: calc(100vw - 48px);
      height: 580px; max-height: calc(100vh - 140px);
      border: none;
      border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,.2);
      z-index: 99998;
      display: none;
      background: #fff;
      overflow: hidden;
    }
    @media (max-width: 480px) {
      #eifron-chat-frame {
        bottom: 0; ${CFG.position}: 0;
        width: 100vw; height: 100vh;
        max-width: 100vw; max-height: 100vh;
        border-radius: 0;
      }
      #eifron-chat-toggle { bottom: 16px; ${CFG.position}: 16px; }
    }
  `;
  document.head.appendChild(style);

  // ── Toggle Button ──
  const btn = document.createElement("button");
  btn.id = "eifron-chat-toggle";
  btn.innerHTML = "💬";
  btn.title = "Eifron Υποστήριξη";
  btn.setAttribute("aria-label", "Άνοιγμα chat υποστήριξης");
  document.body.appendChild(btn);

  // ── Chat iframe (loads demo.html) ──
  const frame = document.createElement("iframe");
  frame.id = "eifron-chat-frame";
  frame.src = CFG.apiUrl + "/chat";
  frame.title = "Eifron Support Chat";
  frame.setAttribute("loading", "lazy");
  document.body.appendChild(frame);

  let open = false;
  btn.addEventListener("click", function () {
    open = !open;
    frame.style.display = open ? "block" : "none";
    btn.innerHTML = open ? "✕" : "💬";
    btn.style.fontSize = open ? "22px" : "28px";
  });

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && open) btn.click();
  });
})();
