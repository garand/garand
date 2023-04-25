import { Heading } from "~/components/Heading";
import { RichText } from "~/components/RichText";

export function Component() {
  return (
    <div>
      <Heading.Level3>
        Composing a Radix Dialog inside of a Dropdown
      </Heading.Level3>
      <div className="h-6" />
      <RichText>
        <p>
          This is a basic example of how to compose a Radix Dialog inside of a
          Radix Dropdown. The key parts to note is the `DropdownMenu.Item` is
          used as the `Dialog.Trigger` with the `asChild` prop. Also, the
          `DropdownMenu.Item` has a `onSelect` handler that prevents the default
          action of the `DropdownMenu.Item` which is to close the menu.
        </p>
        <pre className="bg-slate-100 px-8 py-6 rounded-xl text-base">
          <code>
            {`<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild>
    <Button>Actions</Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
          Open Dialog
        </DropdownMenu.Item>
      </Dialog.Trigger>
      <Dialog.Content>My Dialog Content</Dialog.Content>
    </Dialog.Root>
  </DropdownMenu.Content>
</DropdownMenu.Root>`}
          </code>
        </pre>
        <Heading.Level4>Conditionally Hiding the Dropdown</Heading.Level4>
        <p>
          If you wanted to extend this further, you could hide the dropdown when
          the Dialog is open by controlling the state of the dialog with
          `React.useState` using the `open, onOpenChange` props on
          `Dialog.Root`, setting the state in the `onSelect` of the
          `DropdownMenu.Item` and setting `hidden=isDialogOpen` on the
          `DropdownMenu.Content` element.
        </p>
        <pre className="bg-slate-100 px-8 py-6 rounded-xl text-base">
          <code>
            {`const [isDialogOpen, setIsDialogOpen] = React.useState(false);

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild>
    <Button>Actions</Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content hidden={isDialogOpen}>
    <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Dialog.Trigger asChild>
        <DropdownMenu.Item onSelect={(e) => {
          e.preventDefault();
          setIsDialogOpen(true);
        }}>
          Open Dialog
        </DropdownMenu.Item>
      </Dialog.Trigger>
      <Dialog.Content>My Dialog Content</Dialog.Content>
    </Dialog.Root>
  </DropdownMenu.Content>
</DropdownMenu.Root>`}
          </code>
        </pre>
      </RichText>
    </div>
  );
}

export default Component;
