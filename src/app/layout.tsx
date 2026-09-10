import type { Metadata } from "next";

import { Header } from "@/components/header";
import "@/app/styles.css";

export const metadata: Metadata = {
  title: { default: "Kokeboka", template: "%s · Kokeboka" },
  description: "En varm og personlig kokebok.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nb">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
