import EnablePushNotifications from "@/components/enable-push-notifications";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <EnablePushNotifications />
      {children}
    </div>
  );
}
