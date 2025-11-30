import { type Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Provider } from "@/components/ui/provider";
import { CoreProvider } from "./_components/core-provider";
import { Toaster } from "@/components/ui/toaster";
import refyneLogo from "@/assets/refyne-logo.png";
import "./global.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Refyne",
  description: "Created by alehxalves",
  icons: {
    icon: [refyneLogo.src],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${geistMono.variable}`}>
        <Provider>
          <CoreProvider>
            <Toaster />
            {children}
          </CoreProvider>
        </Provider>
      </body>
    </html>
  );
}
