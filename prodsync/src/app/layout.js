import { Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { LeaveProvider } from "./context/LeaveContext";
import { OvertimeProvider } from "./context/OvertimeContext";

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
        <AuthProvider>
          <LeaveProvider>
            <OvertimeProvider>
              {children}
            </OvertimeProvider>
          </LeaveProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
