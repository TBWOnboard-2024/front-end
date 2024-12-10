/**
 * Site footer
 */
import { RealtHubLogo } from "./assets/RealtHubLogo";

export const Footer = () => {
  return (
    <div className="min-h-0 p-5 bg-base-200">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-2">
        <RealtHubLogo className="h-8 w-8" />
        <div className="text-sm text-center">
          <p className="mb-1">Built on BNB Chain</p>
          <p className="text-gray-500">© 2024 RealtyHub. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
