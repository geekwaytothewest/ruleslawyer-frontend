"use client";
import frontendFetch from "@/utilities/frontendFetch";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CopyModal from "./copy-modal";
import { useDisclosure } from "@nextui-org/react";
import { BsBox2Heart } from "react-icons/bs";
export default function CopyBubbles(props: any) {
  let { copiesIn, gameId, bubbleStyle } = props;

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

  const BubbleModal = ({ c }: any) => {
    const disclosure = useDisclosure({
      onClose: onCloseModal,
    });
    const { isOpen, onOpen, onClose } = disclosure;

    if (bubbleStyle === "boxesOnly") {
      return (
        <div>
          {c.checkOuts.length === 0 || c.checkOuts[0].checkIn !== null ? (
            <BsBox2Heart className="inline-block mr-2 mb-2 text-gwgreen" />
          ) : (
            <BsBox2Heart className="inline-block mr-2 mb-2 text-gwred" />
          )}
        </div>
      );
    }

    return (
      <span
        key={c.id}
        className="flex-col inline-block mb-2 mr-2 bg-gwdarkblue p-3 rounded-full border-4 border-gwgreen hover:border-gwblue hover:text-gwgreen cursor-pointer"
        onClick={onOpen}
      >
        <div>
          {c.checkOuts.length === 0 || c.checkOuts[0].checkIn !== null ? (
            <BsBox2Heart className="inline-block text-gwgreen mr-2 mb-2" />
          ) : (
            <BsBox2Heart className="inline-block text-gwred mr-2 mb-2" />
          )}
          {c.barcodeLabel}
        </div>
        <CopyModal disclosure={disclosure} copyIn={c} copyId={c.id} />
      </span>
    );
  };

  if (bubbleStyle === "statusOnly") {
    const available = copies.filter(
      (c: any) => c.checkOuts.length === 0 || c.checkOuts[0].checkIn !== null
    );

    return (
      <div className="flex flex-wrap w-full">
        {available.length > 0 ? (
          <div className="rounded-full bg-gwgreen p-1 mr-2 mt-2 text-sm text-gwdarkblue">{available.length} Available</div>
        ) : (
          <div></div>
        )}
        {copies.length - available.length > 0 ? (
          <div className="rounded-full bg-gwred p-1 mr-2 mt-2 text-sm text-gwdarkblue">
            {copies.length - available.length} Checked Out
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap w-full">
      {copies?.map((c: any) => (
        <BubbleModal key={c.id} c={c} />
      ))}
    </div>
  );
}
