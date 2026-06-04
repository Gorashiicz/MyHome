"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { signIn } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";

function isNextRedirect(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

export async function loginWithCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/prihlaseni?error=invalid");
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      redirect("/prihlaseni?error=invalid");
    }

    redirect("/projekty");
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      redirect("/prihlaseni?error=invalid");
    }
    console.error("Login failed:", error);
    redirect("/prihlaseni?error=server");
  }
}

export async function registerUser(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Neplatná data" };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Uživatel s tímto e-mailem již existuje." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      passwordHash,
    },
  });

  return { success: true };
}
