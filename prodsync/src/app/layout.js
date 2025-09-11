import { Roboto } from "next/font/google";
import Footer from "./components/Footer";
import "./globals.css";

const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata = {
  title: "ProdSync - Professional Corporate Web App System",
  description: "Streamline your business operations with our comprehensive corporate web application system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} font-roboto antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
