export default function getAddressShortcut(address:string,setAddressShortcut: React.Dispatch<React.SetStateAction<string>>): string{

    const shortcut = address
      ?.split("")
      .map((e, index) => {
        if (index >= 8 && index < address.length - 3) {
          return "";
        } else if (index >= 5 && index < 8) {
          return ".";
        } else {
          return e;
        }
      })
      .join("");
    setAddressShortcut(shortcut);
    return shortcut;
}