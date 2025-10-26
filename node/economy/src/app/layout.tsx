import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Dressed Economy Example",
  description: "This is an example of a Discord bot made using Dressed, it's deployed on Vercel and runs in Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
