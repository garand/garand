export function RichText({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-lg max-w-prose text-slate-500 grid grid-flow-row auto-rows-auto gap-6 leading-normal">
      {children}
    </div>
  );
}
