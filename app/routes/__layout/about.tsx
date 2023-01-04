function getAge(birthDate: string) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

const age = getAge("1991-11-05"); // 32

age;

export default function Component() {
  return (
    <div>
      <div className="max-w-prose">
        <h1 className="text-3xl md:text-4xl lg:text-6xl text-slate-800 font-extrabold mb-6 md:mb-8 lg:mb-10">
          About
        </h1>
        <div className="text-slate-500 text-lg grid grid-flow-row auto-rows-auto gap-6 mb-6 md:mb-12">
          <p>
            I'm Anthony Garand, a {getAge("1991-11-05")} year old front-end
            engineer living in Fort Gratiot, Michigan. I&apos;m married to my
            incredible wife, Michaela, and have been blessed to be a father to
            two beautiful children.
          </p>
          <p>
            I have a passion for the small details. I believe they can make or
            break an experience and although a user may not notice them, they
            will <em>feel</em> them.
          </p>
          <p>
            Currently, I work at Towbook, building and maintaining a large web
            application for the towing industry. I've been working there since
            late 2019.
          </p>
          <p>
            Previously, I worked at LiftUX, aquired by 10up in 2017, where I
            worked on products and websites for clients such as Microsoft, AMC
            Networks, Capital One, PA Media Group, and Stadium.
          </p>
          <p>
            Outside of work, I spend time with my wife and kids, volunteering at
            our church, and trying to catch up on sleep!
          </p>
        </div>
      </div>
      <div className="flex gap-6 flex-col md:flex-row max-w-6xl">
        <div className="flex-1">
          <img
            src="michaela.jpeg"
            className="rounded-xl shadow-xl shadow-slate-600/10"
            alt="Michaela"
          />
        </div>
        <div className="flex-1">
          <img
            src="joseph.jpeg"
            className="rounded-xl shadow-xl shadow-slate-600/10"
            alt="Michaela"
          />
        </div>
        <div className="flex-1">
          <img
            src="evangeline.jpeg"
            className="rounded-xl shadow-xl shadow-slate-600/10"
            alt="Michaela"
          />
        </div>
      </div>
    </div>
  );
}
