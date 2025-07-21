import { Inter } from "next/font/google";
import Head from "next/head";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Seed Cataloger",
  description: "powered by ai",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
