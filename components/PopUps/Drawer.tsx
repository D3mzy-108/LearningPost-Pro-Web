import { useEffect, useState } from "react";
import "@/assets/css/animation.css";

export default function Drawer({
  showDrawer,
  setShowDrawer,
  child,
}: {
  showDrawer: boolean;
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  child: React.ReactElement;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function setAnimationAttributes() {
      const drawer = document.getElementById("drawer-wrapper");
      if (showDrawer) {
        setShow(showDrawer);
        drawer?.classList.remove("slide-out");
        drawer?.classList.add("slide-in");
      } else {
        drawer?.classList.remove("slide-in");
        drawer?.classList.add("slide-out");
        setTimeout(() => {
          setShow(showDrawer);
        }, 300);
      }
    }
    setAnimationAttributes();
  }, [showDrawer]);

  return (
    <div
      id="drawer-wrapper"
      className={`${
        show ? "block" : "hidden"
      } w-screen h-screen fixed top-0 left-0 z-[1000] bg-black/30 slide-in`}
    >
      <div className="w-full max-w-sm h-screen overflow-auto bg-gray-100 shadow-md p-3 ml-auto target">
        <div className="w-full text-start">
          <button
            type="button"
            onClick={() => {
              setShowDrawer(false);
            }}
            className="bg-transparent border-none text-black/80 text-4xl"
          >
            &times;
          </button>
        </div>
        <div className="w-full py-3 px-2 mt-2">{child}</div>
      </div>
    </div>
  );
}
