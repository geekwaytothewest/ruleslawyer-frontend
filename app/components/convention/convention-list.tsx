"use client";
import { Accordion, AccordionItem } from "@nextui-org/react";
import React from "react";
import ConventionInfo from "./convention-info";

export default function ConventionList(props: any) {
  let { conventions } = props;

  return (
    <Accordion variant="bordered">
      {conventions.map(
        (c: {
          id: React.Key | null | undefined;
          name: string
        }) => {
          return (
            <AccordionItem key={c.id} aria-label={c.name} title={c.name}>
              <ConventionInfo id={c.id} />
            </AccordionItem>
          );
        }
      )}
    </Accordion>
  );
}
