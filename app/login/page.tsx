"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/language-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import { signIn, useSession } from "next-auth/react";

function LoginForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('returnUrl');
      
      // Process guest cart items after login
      const guestCartItems = localStorage.getItem('guest-cart-items');
      if (guestCartItems) {
        const items = JSON.parse(guestCartItems);
        
        // Add each item to cart via API sequentially to avoid race conditions
        const migrateItems = async () => {
          for (const item of items) {
            try {
              const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  productId: item.product.id,
                  productName: item.productName,
                  materialId: item.material?.id || null,
                  materialName: item.material?.name || null,
                  designOption: item.designOption,
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  isCustomQuantity: item.isCustomQuantity,
                }),
              });
              
              if (!response.ok) {
                console.error('Login useEffect - Failed to migrate item:', await response.text());
              }
            } catch (error) {
              console.error('Login useEffect - Error migrating guest cart item:', error);
            }
          }
          
          // Clear guest cart items and redirect after all items are processed
          localStorage.removeItem('guest-cart-items');
          router.push(returnUrl || "/");
        };
        
        migrateItems();
      } else {
        router.push(returnUrl || "/");
      }
    }
  }, [session]); // Remove router to prevent excessive rebuilds

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setFieldErrors({});

    // Validation
    const errors: Record<string, string> = {}
    
    if (!email.trim()) {
      errors.email = t.validation.emailRequired;
    } else if (!email.includes("@")) {
      errors.email = t.validation.email;
    }
    
    if (!password.trim()) {
      errors.password = t.validation.required;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        remember: rememberMe,
        redirect: false,
      });

      if (result?.error) {
        setError(t.validation.invalidCredentials);
      } else {
        // Process guest cart items after successful login
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get('returnUrl');
        
        const guestCartItems = localStorage.getItem('guest-cart-items');
        if (guestCartItems) {
          const items = JSON.parse(guestCartItems);
          // Add each item to cart via API
          const migrationPromises = items.map(async (item: any) => {
            try {
              const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  productId: item.product.id,
                  productName: item.productName,
                  materialId: item.material?.id || null,
                  materialName: item.material?.name || null,
                  designOption: item.designOption,
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  isCustomQuantity: item.isCustomQuantity,
                }),
              });
            } catch (error) {
              console.error('Error migrating guest cart item:', error);
            }
          });
          
          // Wait for all items to be added, then redirect
          Promise.all(migrationPromises).then(() => {
            localStorage.removeItem('guest-cart-items');
            window.location.href = returnUrl || "/";
          });
        } else {
          window.location.href = returnUrl || "/";
        }
      }
    } catch (err) {
      setError(t.validation.somethingWentWrong);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    await signIn("google", { callbackUrl: "/" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            P
          </div>
          <span className="font-serif text-xl text-foreground">TPrint</span>
        </Link>
        <LanguageSwitcher />
      </div>

      {/* Login card */}
      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-3xl text-foreground">
              {t.login.title}
            </h1>
            <p className="mt-2 text-muted-foreground">{t.login.subtitle}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">{t.login.emailLabel}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.login.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`h-11 ${fieldErrors.email ? 'border-red-500' : ''}`}
                />
                {fieldErrors.email && (
                  <p className="text-sm text-red-500">{fieldErrors.email}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t.login.passwordLabel}</Label>
                  <Link
                    href="#"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    {t.login.forgotPassword}
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t.login.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`h-11 pr-10 ${fieldErrors.password ? 'border-red-500' : ''}`}
                  />
                  {fieldErrors.password && (
                    <p className="text-sm text-red-500 mt-1">{fieldErrors.password}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={
                      showPassword
                        ? t.common.hidePassword
                        : t.common.showPassword
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal text-muted-foreground"
                >
                  {t.login.rememberMe}
                </Label>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full rounded-full"
                disabled={isLoading}
              >
                {isLoading
                  ? t.login.signingIn || "Signing in..."
                  : t.login.signIn}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">
                {t.login.orContinueWith}
              </span>
              <Separator className="flex-1" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="h-11 rounded-xl"
                onClick={handleGoogleSignIn}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="sr-only">{t.login.google}</span>
              </Button>
              <Button variant="outline" className="h-11 rounded-xl">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="sr-only">{t.login.github}</span>
              </Button>
              <Button variant="outline" className="h-11 rounded-xl">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <span className="sr-only">{t.login.apple}</span>
              </Button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t.login.noAccount}{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              {t.login.signUp}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
