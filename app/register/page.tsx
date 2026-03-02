"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaGoogle, FaGithub, FaApple } from "react-icons/fa";
import { useSession } from "next-auth/react";

function RegisterForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Redirect if logged in
  if (session) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.name.trim()) {
      setError(t.validation.nameRequired);
      setLoading(false);
      return;
    }
    if (!formData.email.trim()) {
      setError(t.validation.emailRequired);
      setLoading(false);
      return;
    }
    if (!formData.email.includes("@")) {
      setError(t.validation.email);
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError(t.validation.passwordMinLength);
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t.validation.passwordMismatch);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Redirect to login after successful registration
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message || t.validation.somethingWentWrong);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            {t.signup.title}
          </CardTitle>
          <CardDescription>{t.signup.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t.signup.fullName}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t.signup.fullNamePlaceholder}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t.signup.emailLabel}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t.signup.emailPlaceholder}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.signup.passwordLabel}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t.signup.passwordPlaceholder}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.signup.confirmPassword}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t.signup.confirmPasswordPlaceholder}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : t.signup.createAccount}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t.signup.orContinueWith}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" className="w-full">
              <FaGoogle className="h-4 w-4" />
              <span className="sr-only">{t.signup.google}</span>
            </Button>
            <Button variant="outline" className="w-full">
              <FaGithub className="h-4 w-4" />
              <span className="sr-only">{t.signup.github}</span>
            </Button>
            <Button variant="outline" className="w-full">
              <FaApple className="h-4 w-4" />
              <span className="sr-only">{t.signup.apple}</span>
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {t.signup.hasAccount}{" "}
            <Link href="/login" className="text-primary hover:underline">
              {t.signup.signIn}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return <RegisterForm />;
}
