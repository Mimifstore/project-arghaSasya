"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "argha-sasya-trained";

// Status lulus pelatihan (gatekeeper) disimpan di browser agar terbawa antarhalaman pada demo.
export function useTrained() {
  const [state, setState] = useState({ ready: false, trained: false });
  useEffect(() => {
    let t = false;
    try { t = localStorage.getItem(KEY) === "1"; } catch {}
    setState({ ready: true, trained: t });
  }, []);
  const set = useCallback((v: boolean) => {
    try { v ? localStorage.setItem(KEY, "1") : localStorage.removeItem(KEY); } catch {}
    setState({ ready: true, trained: v });
  }, []);
  return { ...state, set };
}
