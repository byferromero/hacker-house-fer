import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hacker House Sevilla 2026 | 18-22 Abril",
  description: "Retiro de 5 días para builders en Sevilla durante la Feria de Abril. Construye proyectos, comparte código y conecta con otros makers.",
  keywords: ["hacker house", "sevilla", "feria de abril", "builders", "indie hackers", "vibe coders", "hackathon"],
  openGraph: {
    title: "Hacker House Sevilla 2026",
    description: "5 días construyendo proyectos en Sevilla // 18-22 Abril",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hacker House Sevilla 2026",
    description: "5 días construyendo proyectos en Sevilla // 18-22 Abril",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
