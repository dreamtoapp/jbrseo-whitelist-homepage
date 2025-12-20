import Script from "next/script";

type StructuredDataScriptProps = {
  structuredData: Record<string, unknown>;
};

export function StructuredDataScript({ structuredData }: StructuredDataScriptProps) {
  return (
    <Script id="structured-data" type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify(structuredData)}
    </Script>
  );
}
