import setStatusMessage from "./setStatusMessage";

export default function handleCopyClipboard(context: string | null | undefined, setClipboardStatus: React.Dispatch<React.SetStateAction<string | null>>,) {
    if (context) {
        if (navigator.clipboard) {
            navigator.clipboard
                .writeText(context)
                .then(() => {
                    setStatusMessage("复制成功", setClipboardStatus, 2000);

                })
                .catch((_) => {
                    setStatusMessage("复制失败", setClipboardStatus, 2000);

                });
            return;
        } else {
            setStatusMessage("浏览器不支持", setClipboardStatus, 2000);

            return;
        }
    } else {
        setStatusMessage("无内容供复制", setClipboardStatus, 2000);

    }
};