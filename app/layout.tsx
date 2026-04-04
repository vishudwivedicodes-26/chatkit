import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CipherTalk (ChatKit)",
  description: "Anonymous encrypted messaging platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full w-full overflow-hidden bg-base text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
