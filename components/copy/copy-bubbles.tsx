"use client";
import frontendFetch from "@/utilities/frontendFetch";
import { useAuth } from "@/utilities/swr/useAuth";
import { useCallback, useEffect, useState } from "react";
import CopyModal from "./copy-modal";
import { useDisclosure } from "@heroui/react";
import { BsBox2Heart } from "react-icons/bs";

function BubbleModal({ c, bubbleStyle, onCloseModal }: any) {
  const disclosure = useDisclosure({ onClose: onCloseModal });
  const { onOpen } = disclosure;

  if (bubbleStyle === "boxesOnly") {
    return (
      <div>
        {c.checkOuts.length === 0 || c.checkOuts[0].checkIn !== null ? (
          <BsBox2Heart role="img" aria-label="Available" className="inline-block mr-2 mb-2 text-gwgreen" />
        ) : (
          <BsBox2Heart role="img" aria-label="Checked out" className="inline-block mr-2 mb-2 text-gwdarkred" />
        )}
      </div>
    );
  }

  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={"Copy " + c.barcodeLabel}
      className="flex-col inline-block mb-2 mr-2 bg-gwdarkblue p-3 rounded-full border-4 border-gwgreen hover:border-gwblue hover:text-gwgreen cursor-pointer"
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <div>
        {c.checkOuts.length === 0 || c.checkOuts[0].checkIn !== null ? (
          <BsBox2Heart role="img" aria-label="Available" className="inline-block text-gwgreen mr-2 mb-2" />
        ) : (
          <BsBox2Heart role="img" aria-label="Checked out" className="inline-block text-gwdarkred mr-2 mb-2" />
        )}
        {c.barcodeLabel}
      </div>
      <CopyModal disclosure={disclosure} copyIn={c} copyId={c.id} organizationId={c.organizationId} />
    </span>
  );
}

export default function CopyBubbles(props: any) {
  let { game, bubbleStyle, disclosure, archived } = props;

  const [copies, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);

  const { onClose } = disclosure;
  const session: any = useAuth();

  const onCloseModal = useCallback(() => {
    frontendFetch("GET", "/game/" + game.id, null, session?.data?.token)
      .then((res: any) => res.json())
      .then((data: any) => {
        setData(data.copies);
        onClose();
        setLoading(false);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.id, session?.data?.token]);

  useEffect(() => {
    if (game?.copies) {
      setData(game.copies);
      setLoading(false);
    } else {
      frontendFetch("GET", "/game/" + game.id, null, session?.data?.token)
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data.copies);
          setLoading(false);
        })
        .catch(() => {});
    }
  }, [game?.id, session?.data?.token]);

  if (isLoading) return <div></div>;
  if (!copies) return <div></div>;

  if (bubbleStyle === "statusOnly") {
    let available = copies.filter(
      (c: any) => c.checkOuts.length === 0 || c.checkOuts[0].checkIn !== null
    ).sort();

    if (archived) {
      available = 0;
    }

    return (
      <div className="flex flex-wrap w-full">
        {available.length > 0 ? (
          <div className="rounded-full bg-gwgreen p-1 mr-2 mt-2 text-sm text-gwdarkblue">{available.length} Available</div>
        ) : (
          <div></div>
        )}
        {copies.length - available.length > 0 ? (
          <div className="rounded-full bg-gwdarkred p-1 mr-2 mt-2 text-sm text-gwdarkblue">
            {copies.length - available.length} Checked Out
          </div>
        ) : (
          <div></div>
        )}
        {available === 0 ? (
          <div className="rounded-full bg-bggorange p-1 mr-2 mt-2 text-sm text-white">
            {copies.length} Archived
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
        <BubbleModal key={c.id} c={c} bubbleStyle={bubbleStyle} onCloseModal={onCloseModal} />
      ))}
    </div>
  );
}
