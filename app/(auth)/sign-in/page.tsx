import { redirect } from "next/navigation";

import { SigninForm } from "@/features/auth/components/signin-form";

import { getCurrentSession } from "@/lib/auth/session";

export default async function SigninPage() {
  const { session, user } = await getCurrentSession();
  if (session !== null) {
    if (!user.emailVerified) {
      return redirect("/email-verification");
    }

    return redirect("/");
  }

  return <SigninForm />;
}
