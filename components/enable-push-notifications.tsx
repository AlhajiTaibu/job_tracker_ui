"use client";

import { useEffect } from "react";
import { app } from "@/lib/firebase";
import { useHandleRegisterDevice } from "@/hooks/use-notification";

export default function EnablePushNotifications() {
  const { handleRegisterDevice } = useHandleRegisterDevice();

  useEffect(() => {
    async function setup() {
      if (typeof window === "undefined") return;
      if (!("Notification" in window)) return;
      if (!("serviceWorker" in navigator)) return;

      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const messagingModule = await import("firebase/messaging");
      const { getMessaging, getToken, onMessage } = messagingModule;

      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
      );

      const messaging = getMessaging(app);

      const fcmToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (fcmToken) {
        const data = {
          token: fcmToken,
          platform: "web",
        };
        handleRegisterDevice(data);
      }
    }

    setup();
  }, [handleRegisterDevice]);

  return null;
}
