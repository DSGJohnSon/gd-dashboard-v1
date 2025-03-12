import { getCurrent } from "@/features/auth/actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "GoDigital - Votre Dashboard Personnel",
  description: "",
};

export default async function Home() {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }
  if (user.labels.includes("admin")) {
    redirect("/admin/dashboard");
  }

  return <div>Homepage</div>;
}
