import type { Metadata } from "next";
import { Archivo, Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dashboard SISU UFMA",
  description: "Dashboard analítico do SISU da UFMA — histórico de cursos, notas e concorrência.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${roboto.variable} ${archivo.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
