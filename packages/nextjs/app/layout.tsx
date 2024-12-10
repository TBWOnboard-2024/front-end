import "@rainbow-me/rainbowkit/styles.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { Footer } from "~~/components/Footer";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({ title: "RealtyHub", description: "Built on BNB Chain" });

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
