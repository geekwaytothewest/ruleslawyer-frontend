"use client";
import {
  Accordion,
  AccordionItem,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import ConventionInfo from "./convention-info";
import { IoMdAddCircle } from "react-icons/io";
import ConventionModal from "./convention-modal";
import frontendFetch from "@/utilities/frontendFetch";
import { useSession } from "next-auth/react";

export default function ConventionList(props: any) {
  let { conventionsIn, organizationId } = props;

  const [conventions, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);
  const [activeConvention, setActiveConvention]: any = useState(undefined);

  const session: any = useSession();

  useEffect(() => {
    if (conventionsIn) {
      setData(conventionsIn);
      setLoading(false);
    } else {
      frontendFetch(
        "GET",
        "/org/" + organizationId + "/conventions",
        null,
        session?.data?.token
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);
          setLoading(false);
        })
        .catch((err: any) => {});
    }
  }, [conventionsIn, organizationId, session?.data?.token]);

  useEffect(() => {
    if (activeConvention === undefined) {
      setActiveConvention(
        conventions?.find(
          (c: any) =>
            c.startDate < Date.now() && Date.parse(c.endDate) > Date.now()
        )
      );

      if (activeConvention === undefined) {
        setActiveConvention(
          conventions?.find((c: any) => Date.parse(c.startDate) > Date.now())
        );
      }
    }
  }, [conventions, activeConvention]);

  const onModalClose = () => {
    frontendFetch(
      "GET",
      "/org/" + organizationId + "/conventions",
      null,
      session?.data?.token
    )
      .then((res: any) => res.json())
      .then((data: any) => {
        setData(data);
        setLoading(false);
      })
      .catch((err: any) => {});
  };

  const createDisclosure = useDisclosure({
    onClose: onModalClose,
  });

  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onClose: onCloseCreate,
  } = createDisclosure;

  const editDisclosure = useDisclosure({
    onClose: onModalClose,
  });

  return (
    <div>
      <Accordion
        variant="bordered"
        defaultExpandedKeys={[String(activeConvention?.id)]}
      >
        {conventions?.map(
          (c: { id: React.Key | null | undefined; name: string }) => {
            return (
              <AccordionItem key={c.id} aria-label={c.name} title={c.name}>
                <ConventionInfo id={c.id} editDisclosure={editDisclosure} />
              </AccordionItem>
            );
          }
        )}
      </Accordion>

      <IoMdAddCircle
        className="text-7xl absolute bottom-8 right-8 hover:text-gwgreen hover:cursor-pointer"
        onClick={onOpenCreate}
      />
      <ConventionModal
        disclosure={createDisclosure}
        organizationId={organizationId}
      ></ConventionModal>
    </div>
  );
}
