import { Heading } from "~/components/Heading";

export default function Component() {
  return (
    <div>
      <div className="max-w-prose">
        <Heading.Level2>Uses</Heading.Level2>
        <div className="text-slate-500 text-lg grid grid-flow-row auto-rows-auto gap-6 mb-6 md:mb-12">
          <p>
            This is a list of the gear I use on a daily basis. I&apos;ll try to
            keep this updated as I change things.
          </p>
          <aside className="rounded-lg bg-amber-50 px-6 py-5 text-amber-600 font-medium text-base">
            <span className="mr-2 inline-flex">🚧</span> Under Construction,
            lol.
          </aside>
          <h2 className="text-slate-800 font-semibold text-2xl mt-2 -mb-2">
            Software
          </h2>
          <p>
            I write all of my code in{" "}
            <a
              href="https://code.visualstudio.com"
              target="_blank"
              rel="noreferrer"
              className="text-sky-600 dark:text-sky-500 decoration-sky-600/50 dark:decoration-sky-500/50 underline underline-offset-2 decoration-2"
            >
              Visual Studio Code
            </a>
            . Previously I had a nicely crafted Neovim/tmux setup, however the
            extensions and features of Visual Studio Code outweighed the
            benefits of a terminal based setup for me.
          </p>
          <h3 className="text-slate-800 font-medium -mb-2 mt-2">
            Visual Studio Code Extensions
          </h3>
          <ul className="list-disc ml-4">
            <li>VIM</li>
            <li>Tailwind</li>
            <li>GitHub Copilot</li>
            <li>Prettier</li>
            <li>File Utils</li>
            <li>Multiple cursor case preserve</li>
          </ul>
          <h2 className="text-slate-800 font-semibold text-2xl mt-2 -mb-2">
            Hardware
          </h2>
          <p>
            I write code on a 2021 16" M1 Max MacBook Pro. It's the best
            computer I've ever owned, by a mile. It lives in clamshell mode 90%
            of the time. I split my time between an office and working from
            home, at the office I have three Apple Studio Displays mounted on
            Fully arms, connected to the laptop through a CalDigit Thunderbolt 4
            Dock. At home, I am using two Dell 32" 4K monitors mounted on VIVO
            arms, connected to the laptop through a CalDigit Thunderbolt 3 Dock.
          </p>
          <p>
            I use a Logitech MX Master 3 mouse, and a Logitech Ergo K860
            keyboard.
          </p>
          <p>
            For any auxilliary tasks, reading, sketching, and general portable
            computing, I use a 2022 11" iPad Pro, with an Apple Pencil and Magic
            Keyboard.
          </p>
          <p>My current phone of choice is an iPhone 12 Pro.</p>
          <h2 className="text-slate-800 font-semibold text-2xl mt-2 -mb-2">
            Colophon
          </h2>
          <p>
            This website is powered by Remix, the CSS is manged with Tailwind,
            and the entire site is hosted on Fly.io.
          </p>
        </div>
      </div>
    </div>
  );
}
