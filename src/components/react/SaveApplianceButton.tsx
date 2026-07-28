import { useEffect, useState } from "react";
import {
  APPLIANCE_STORAGE_EVENT,
  readSavedAppliances,
  toggleSavedAppliance,
} from "@/utils/applianceStorage";

interface Props {
  modelId: string;
}

export default function SaveApplianceButton({ modelId }: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => {
      setSaved(readSavedAppliances().some((item) => item.modelId === modelId));
    };

    sync();
    window.addEventListener(APPLIANCE_STORAGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(APPLIANCE_STORAGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [modelId]);

  return (
    <button
      className={`button ${saved ? "button-secondary" : "button-primary"}`}
      type="button"
      aria-pressed={saved}
      onClick={() => {
        const next = toggleSavedAppliance(modelId);
        setSaved(next.some((item) => item.modelId === modelId));
      }}
    >
      {saved ? "내 가전함에서 빼기" : "내 가전함에 추가"}
    </button>
  );
}
