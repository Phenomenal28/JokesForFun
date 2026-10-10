import { Toaster as SonnerToaster } from "sonner";

/**
 * Global toast listener. Mounted once at the app root. Styled with the riso
 * design tokens so toasts match the poster aesthetic instead of a generic SaaS look.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "print-block-sm bg-surface text-foreground meta border-2 border-foreground",
          description: "text-muted-foreground",
        },
      }}
      style={
        {
          "--normal-bg": "var(--surface)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
          "--borderRadius": "var(--radius)",
        } as React.CSSProperties
      }
    />
  );
}
