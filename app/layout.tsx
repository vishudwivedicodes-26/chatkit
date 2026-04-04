import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChatKit",
  description: "Anonymous encrypted messaging",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full w-full">{children}</body>
    </html>
  );
}
