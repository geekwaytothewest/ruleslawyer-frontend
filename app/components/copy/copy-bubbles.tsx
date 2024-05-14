"use client";
import frontendFetch from "@/utilities/frontendFetch";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CopyModal from "./copy-modal";
import { useDisclosure } from "@nextui-org/react";
export default function CopyBubbles(props: any) {
  let { copiesIn, gameId } = props;

  const [copies, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);

  const onCloseModal = () => {
    frontendFetch("GET", "/game/" + gameId + "/copies", null, session)
      .then((res: any) => res.json())
      .then((data: any) => {
        setData(data);
        setLoading(false);
      })
      .catch((err: any) => {});
  };

  const disclosure = useDisclosure({
    onClose: onCloseModal,
  });
  const { isOpen, onOpen, onClose } = disclosure;

  const session = useSession();

  useEffect(() => {}, [session]);

  useEffect(() => {
    if (copiesIn) {
      setData(copiesIn);
      setLoading(false);
    } else {
      frontendFetch("GET", "/game/" + gameId + "/copies", null, session)
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);
          setLoading(false);
        })
        .catch((err: any) => {});
    }
  }, [copiesIn, gameId, session]);

  if (isLoading) return <div></div>;
  if (!copies) return <div></div>;

  return (
    <div>
      {copies?.map((c: any) => {
        return (
          <span
            key={c.id}
            className="flex-col inline-block mb-2 mr-2 bg-gwdarkblue p-3 rounded-full border-4 border-gwgreen hover:border-gwblue hover:text-gwgreen cursor-pointer"
            onClick={onOpen}
          >
            <div>
              {c.checkOuts.length === 0 || c.checkOuts[0].checkIn !== null ? (
                <div className="inline-block mr-2 w-4 h-4 rounded-full bg-gwgreen"></div>
              ) : (
                <div className="inline-block mr-2 w-4 h-4 rounded-full bg-gwred"></div>
              )}
              {c.barcodeLabel}
            </div>
            <CopyModal disclosure={disclosure} copyIn={c} copyId={c.id} />
          </span>
        );
      })}
    </div>
  );
}
