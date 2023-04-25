function HeadingLevel1(props: React.ComponentPropsWithoutRef<"h1">) {
  return (
    <h1
      {...props}
      className="text-7xl font-black text-slate-800 tracking-tight mb-6"
    />
  );
}

function HeadingLevel2(props: React.ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      {...props}
      className="text-3xl md:text-4xl lg:text-6xl text-slate-800 font-extrabold mb-6 md:mb-8 lg:mb-10 tracking-tight"
    />
  );
}

function HeadingLevel3(props: React.ComponentPropsWithoutRef<"h3">) {
  return (
    <h3
      {...props}
      className="text-slate-800 font-extrabold text-4xl tracking-tight"
    />
  );
}

function HeadingLevel4(props: React.ComponentPropsWithoutRef<"h4">) {
  return (
    <h4
      {...props}
      className="text-slate-800 font-semibold text-2xl mt-2 -mb-2"
    />
  );
}

function HeadingLevel5(props: React.ComponentPropsWithoutRef<"h5">) {
  return (
    <h5 {...props} className="font-semibold text-xl text-slate-800 mb-2" />
  );
}

function HeadingLevel6(props: React.ComponentPropsWithoutRef<"h6">) {
  return <h6 {...props} className="text-slate-800 font-medium -mb-2 mt-2" />;
}

export const Heading = {
  Level1: HeadingLevel1,
  Level2: HeadingLevel2,
  Level3: HeadingLevel3,
  Level4: HeadingLevel4,
  Level5: HeadingLevel5,
  Level6: HeadingLevel6,
};
