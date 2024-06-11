"use client";
import { Accordion, AccordionItem, useDisclosure } from "@nextui-org/react";
import React, { act, useEffect, useState } from "react";
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
  const [selectedKeys, setSelectedKeys]: any = React.useState(new Set([""]));

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
      //Is a convention currently running? Make it active
      let active = conventions?.find(
        (c: any) =>
          Date.parse(c.startDate) < Date.now() &&
          Date.parse(c.endDate) > Date.now()
      );

      if (active) {
        setActiveConvention(active);
        setSelectedKeys(new Set([String(active.id)]));
      }

      //If we didn't get an active convention, get the next convention and make it active
      if (!active) {
        active = conventions?.findLast(
          (c: any) => Date.parse(c.startDate) > Date.now()
        );

        if (active) {
          setActiveConvention(active);
          setSelectedKeys(new Set([String(active.id)]));
        }
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

  const importDisclosure = useDisclosure({
    onClose: onModalClose,
  });

  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onClose: onCloseCreate,
  } = createDisclosure;

  return (
    <div>
      <Accordion
        variant="bordered"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        {conventions?.map(
          (c: {
            theme: string;
            id: React.Key | null | undefined;
            name: string;
          }) => {
            return (
              <AccordionItem
                key={c.id}
                title={<span className="text-gwgreen">{c.name}</span>}
                subtitle={<span className="text-gwgreen">{c.theme}</span>}
              >
                <ConventionInfo id={c.id} hideTitle={true} hideSubtitle={true} />
              </AccordionItem>
            );
          }
        )}
      </Accordion>

      <IoMdAddCircle
        className="text-7xl fixed bottom-8 right-8 hover:text-gwgreen hover:cursor-pointer"
        onClick={onOpenCreate}
      />

      <ConventionModal
        disclosure={createDisclosure}
        organizationId={organizationId}
      />
    </div>
  );
}
