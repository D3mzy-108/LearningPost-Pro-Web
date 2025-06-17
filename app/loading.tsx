import loadingImg from "@/assets/images/loading.png";
import Image from "next/image";

export default function Loading() {
  return (
    <>
      <div className="w-screen h-screen p-12 grid place-items-center">
        <Image src={loadingImg} alt="Loading..." width={300} height={300} />
      </div>
    </>
  );
}
