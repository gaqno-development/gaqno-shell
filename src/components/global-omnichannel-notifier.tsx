import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  SHELL_NOTIFICATION_EVENT,
  type ShellNotificationPayload,
} from "@gaqno-development/frontcore/notifications";
import { useUIStore } from "@gaqno-development/frontcore/store/uiStore";

function playNotificationBeep(): void {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
    osc.onended = () => ctx.close();
  } catch {
    // AudioContext unavailable (e.g. jsdom in tests)
  }
}

export function GlobalNotificationHub() {
  const { pathname } = useLocation();
  const incrementOmnichannelUnread = useUIStore(
    (s) => s.incrementOmnichannelUnread,
  );
  const resetOmnichannelUnread = useUIStore((s) => s.resetOmnichannelUnread);
  const addShellNotification = useUIStore((s) => s.addShellNotification);

  useEffect(() => {
    if (pathname.startsWith("/omnichannel")) {
      resetOmnichannelUnread();
    }
  }, [pathname, resetOmnichannelUnread]);

  useEffect(() => {
    const handleNotification = (e: Event) => {
      const payload = (e as CustomEvent<ShellNotificationPayload>).detail;
      const { app, direction } = payload;

      addShellNotification(payload);

      if (
        app === "omnichannel" &&
        direction === "inbound" &&
        !pathname.startsWith("/omnichannel")
      ) {
        incrementOmnichannelUnread();
        playNotificationBeep();
      }
    };
    window.addEventListener(SHELL_NOTIFICATION_EVENT, handleNotification);
    return () =>
      window.removeEventListener(SHELL_NOTIFICATION_EVENT, handleNotification);
  }, [pathname, incrementOmnichannelUnread, addShellNotification]);

  return null;
}
