import Image from "next/image";

export function ToastHeader() {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Image
        src="/assets/logo.png"
        alt="JBRseo"
        width={24}
        height={24}
        className="h-6 w-6 object-contain"
      />
      <span className="text-sm font-bold text-foreground">JBRseo</span>
    </div>
  );
}



