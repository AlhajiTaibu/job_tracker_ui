importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyCSeq7Py0BT_HzMDUQ - It_0Jm9i117HqYs",
    authDomain: "job-tracker-1a7b0.firebaseapp.com",
    projectId: "job-tracker-1a7b0",
    messagingSenderId: "1017773475644",
    appId: "1:1017773475644:web:7a4b211bb4c2668ae28039",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    const title = payload.notification?.title || "Notification";
    const options = {
        body: payload.notification?.body || "",
        icon: "/icon.png",
    };

    self.registration.showNotification(title, options);

});

