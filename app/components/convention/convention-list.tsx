"use client";
import { Accordion, AccordionItem } from "@nextui-org/react";
import React, { act } from "react";
import ConventionInfo from "./convention-info";

export default function ConventionList(props: any) {
  let { conventions } = props;

  let activeConvention = conventions.find(
    (c: any) => c.startDate < Date.now() && Date.parse(c.endDate) > Date.now()
  );

  if (activeConvention === undefined) {
    activeConvention = conventions.find((c: any) => Date.parse(c.startDate) > Date.now());
  }
  return (
    <Accordion variant="bordered" defaultExpandedKeys={[String(activeConvention?.id)]}>
      {conventions.map(
        (c: { id: React.Key | null | undefined; name: string }) => {
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
