export default function setStatusMessage(
    message: string,
    setClipboardStatus: (value: React.SetStateAction<string | null>) => void,
    timer: number,
) {
    setClipboardStatus(message);
    const timeout = setTimeout(() => {

        setClipboardStatus(null);
    }, timer);
    return () => clearTimeout(timeout);
}