"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Shield,
  User,
  Palette,
  Download,
  Trash2,
  LogOut,
  UserCog,
  Loader2,
} from "lucide-react";
import { clientPost } from "@/lib/client-auth";
import { useRouter } from "next/navigation";
import {
  useHandleUpdateProfile,
  useProfile,
  useHandleUploadAvatar,
  useProfileStore,
} from "@/hooks/use-profile";
import { Profile } from "@/lib/types";
import { useTheme } from "next-themes";
import { AppHeader } from "@/components/app-header";

export default function SettingsClient() {
  const router = useRouter();
  const { data: profileData } = useProfile();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const profile = profileData?.payload ?? ({} as Profile);

  const [form, setForm] = useState({
    firstName: profile?.first_name || "",
    lastName: profile?.last_name || "",
    title: profile?.title || "",
  });

  const [formError, setFormError] = useState<string>("");
  const isUpdating = useProfileStore((state) => state.isUpdating);
  const { handleUpdateProfile } = useHandleUpdateProfile();
  const { handleUploadAvatar } = useHandleUploadAvatar();
  const [preview, setPreview] = useState<string | null>(null);

  const initials =
    `${profile?.first_name} ${profile?.last_name}`
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "JD";

  const handleLogOut = async () => {
    setMessage("");
    setServerError("");
    setIsLoading(true);
    try {
      const res = await clientPost<{ message?: string }>(
        "/api/auth/logout",
        {},
      );
      setMessage(res.message || "Logout successful");
      router.push("/login");
    } catch (error) {
      setServerError(
        error instanceof Error ? error?.message : "Log out failed",
      );
    } finally {
      setIsLoading(false);
      setMessage("");
      setServerError("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async () => {
    setFormError("");
    try {
      const email = profile?.email ?? "";
      const payload = {
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        title: form.title.trim(),
        email: email,
      };

      const original = {
        first_name: (profile?.first_name ?? "").trim(),
        last_name: (profile?.last_name ?? "").trim(),
        title: (profile?.title ?? "").trim(),
        email: email,
      };

      const hasChanged =
        payload.first_name !== original.first_name ||
        payload.last_name !== original.last_name ||
        payload.title !== original.title ||
        payload.email !== original.email;

      if (!hasChanged) return;

      await handleUpdateProfile(payload);
    } catch (error) {
      setFormError(
        error instanceof Error ? error?.message : "Error updating profile",
      );
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    handleUploadAvatar(file);
  };

  const [mobileOpen, setMobileOpen] = useState(false);

  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader
          headerTitle="Settings"
          headerDescription={"Manage your account and preferences"}
          setMobileOpen={setMobileOpen}
        />

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mx-auto max-w-2xl space-y-6">
            {/* Profile Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Profile</CardTitle>
                </div>
                <CardDescription>Your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={preview || profile?.avatar_url || ""}
                      alt={profile?.first_name || "User avatar"}
                    />
                    <AvatarFallback className="bg-primary/10 text-lg text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Input
                      id="avatar"
                      name="avatar"
                      className="hidden"
                      type="file"
                      onChange={handleAvatarChange}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("avatar")?.click()}
                    >
                      Change Avatar
                    </Button>
                    <p className="mt-1 text-xs text-muted-foreground">
                      JPG, PNG or GIF. 1MB max.
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={profile.email}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <Button disabled={isUpdating} onClick={handleProfileUpdate}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Changes
                    </>
                  ) : (
                    <p>Save Changes</p>
                  )}
                </Button>
                {formError && (
                  <p className="text-xs text-red-600">{formError}</p>
                )}
              </CardContent>
            </Card>

            {/* Notifications Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Notifications</CardTitle>
                </div>
                <CardDescription>
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about your applications via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified in your browser
                    </p>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly summary of your job search progress
                    </p>
                  </div>
                  <Switch
                    checked={weeklyDigest}
                    onCheckedChange={setWeeklyDigest}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Appearance</CardTitle>
                </div>
                <CardDescription>Customize the look and feel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use dark theme for the interface
                    </p>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) =>
                      setTheme(checked ? "dark" : "light")
                    }
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UserCog className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>User Management</CardTitle>
                </div>
                <CardDescription>Manage user session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleLogOut}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                >
                  {isLoading ? (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logging Out...
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </>
                  )}
                </Button>
                {serverError && (
                  <p className="text-xs text-red-600">{serverError}</p>
                )}
              </CardContent>
            </Card>
            {/* Data & Privacy Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Data & Privacy</CardTitle>
                </div>
                <CardDescription>
                  Manage your data and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export All Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
