import { WhitelistFormTrigger } from "./WhitelistFormTrigger";

export function FloatingMobileCTA() {
  return (
    <>
      {/* Floating Mobile CTA */}
      <div className="fixed bottom-0 inset-x-0 z-50 border-t border-foreground/10 bg-background/95 p-3 backdrop-blur-xl sm:hidden">
        <WhitelistFormTrigger variant="floating" />
      </div>

      {/* Add padding at bottom for mobile CTA */}
      <div className="h-20 sm:hidden" />
    </>
  );
}

