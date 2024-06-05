"use client";
import frontendFetch from "@/utilities/frontendFetch";
import {
  Button,
  DateInput,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import usePermissions from "@/utilities/swr/usePermissions";
import {
  ZonedDateTime,
  parseZonedDateTime,
  now,
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";

export default function ConventionModal(props: any) {
  let { conventionIn, conventionId, organizationId, disclosure } = props;

  const [convention, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);
  const [conventionTypes, setConventionTypes]: any = useState(null);
  const [isLoadingConventionTypes, setLoadingConventionTypes]: any =
    useState(true);
  const [conventionTypeId, setConventionTypeId]: any = useState(undefined);
  const [conventionName, setConventionName]: any = useState(null);
  const [conventionTheme, setConventionTheme]: any = useState(null);
  const [tteConventionId, setTTEConventionId]: any = useState(null);
  const [startDate, setStartDate]: any = useState(now(getLocalTimeZone()));
  const [startTime, setStartTime]: any = useState(now(getLocalTimeZone()));
  const [endDate, setEndDate]: any = useState(null);
  const [endTime, setEndTime]: any = useState(null);
  const [readOnly, setReadOnly]: any = useState(true);
  const {
    permissions,
    isLoading: isLoadingPermissions,
    isError,
  }: any = usePermissions();

  const session: any = useSession();

  const { isOpen, onOpen, onClose } = disclosure;

  const onSave = () => {
    if (convention) {
      frontendFetch(
        "PUT",
        "/convention/" + convention.id,
        {
          name: conventionName,
          theme: conventionTheme,
          tteConventionId: tteConventionId,
          startDate: startDate.toAbsoluteString(),
          endDate: endDate.toAbsoluteString(),
          type: {
            connect: {
              id: conventionTypeId,
            },
          },
        },
        session?.data?.token
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          onClose();
        })
        .catch((err: any) => {});
    } else {
      frontendFetch(
        "POST",
        "/org/" + organizationId + "/con",
        {
          name: conventionName,
          theme: conventionTheme,
          tteConventionId: tteConventionId,
          startDate: startDate.toAbsoluteString(),
          endDate: endDate.toAbsoluteString(),
          type: {
            connect: {
              id: conventionTypeId,
            },
          },
        },
        session?.data?.token
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          onClose();
        })
        .catch((err: any) => {});
    }
  };

  useEffect(() => {}, [session]);

  useEffect(() => {
    if (conventionIn) {
      setData(conventionIn);

      setConventionName(conventionIn.name);
      setConventionTheme(conventionIn.theme);
      setTTEConventionId(conventionIn.tteConventionId);
      setConventionTypeId(conventionIn.conventionTypeId);

      const parsedStart = parseAbsoluteToLocal(conventionIn.startDate);
      const parsedEnd = parseAbsoluteToLocal(conventionIn.endDate);

      setStartDate(parsedStart);
      setStartTime(parsedStart);
      setEndDate(parsedEnd);
      setEndTime(parsedEnd);

      setLoading(false);
    } else if (conventionId) {
      frontendFetch("GET", "/con/" + conventionId, null, session?.data?.token)
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);

          setConventionName(data.name);
          setConventionTheme(data.theme);
          setTTEConventionId(data.tteConventionId);
          setConventionTypeId(data.conventionTypeId);

          const parsedStart = parseAbsoluteToLocal(conventionIn.startDate);
          const parsedEnd = parseAbsoluteToLocal(conventionIn.endDate);

          setStartDate(parsedStart);
          setStartTime(parsedStart);
          setEndDate(parsedEnd);
          setEndTime(parsedEnd);

          setLoading(false);
        })
        .catch((err: any) => {});
    } else {
      setLoading(false);
    }
  }, [conventionId, conventionIn, session?.data?.token]);

  useEffect(() => {
    if (permissions.user) {
      if (convention) {
        if (
          permissions.organizations.data?.filter(
            (d: { organizationId: any; admin: boolean }) =>
              d.organizationId == convention.organizationId && d.admin === true
          ).length > 0
        ) {
          setReadOnly(false);
        } else {
          if (
            permissions.con?.data?.filter(
              (d: { conventionId: any; admin: boolean }) =>
                convention.collection.conventions.filter(
                  (c: { conventionId: any }) => d.conventionId == c.conventionId
                ) && d.admin === true
            ).length > 0
          ) {
            setReadOnly(false);
          } else {
            setReadOnly(true);
          }
        }
      } else if (organizationId) {
        if (
          permissions.organizations.data?.filter(
            (d: { organizationId: any; admin: boolean }) =>
              d.organizationId == organizationId && d.admin === true
          ).length > 0
        ) {
          setReadOnly(false);
        } else {
          setReadOnly(true);
        }
      } else {
        setReadOnly(true);
      }
    }
  }, [permissions, convention, organizationId]);

  useEffect(() => {
    if (organizationId) {
      frontendFetch(
        "GET",
        "/org/" + organizationId + "/conventionType",
        null,
        session?.data?.token
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          setConventionTypes(data);
          setLoadingConventionTypes(false);
        })
        .catch((err: any) => {});
    }
  }, [organizationId, session]);

  if (isLoading || isLoadingPermissions || isLoadingConventionTypes)
    return <div></div>;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <div>
            <ModalHeader>
              {conventionId ? "Edit" : "Create"} Convention
            </ModalHeader>
            <ModalBody>
              <Select
                name="conventionTypeSelect"
                items={conventionTypes}
                label="Current convention type"
                placeholder="Select a convention type"
                defaultSelectedKeys={[conventionTypeId]}
                isDisabled={readOnly}
                onChange={(event) => {
                  setConventionTypeId(Number(event.target.value));
                }}
              >
                {(conventionType: any) => (
                  <SelectItem
                    key={conventionType.id}
                    value={conventionType.name}
                  >
                    {conventionType.name}
                  </SelectItem>
                )}
              </Select>
              <Input
                name="name"
                type="text"
                isRequired
                label="Name"
                value={conventionName}
                onValueChange={(value) => setConventionName(value)}
                isDisabled={readOnly}
              />
              <Input
                name="theme"
                type="text"
                label="Theme"
                value={conventionTheme}
                onValueChange={(value) => setConventionTheme(value)}
                isDisabled={readOnly}
              />
              <Input
                name="tteConventionId"
                type="TTE Convention Id"
                placeholder="Enter the convention id from Tabletop.Events"
                value={tteConventionId ?? ""}
                onValueChange={(value) => setTTEConventionId(value)}
                isDisabled={readOnly}
              />
              <DatePicker
                label="Start Date"
                isRequired
                showMonthAndYearPickers
                onChange={(value) => setStartDate(value)}
                defaultValue={now(getLocalTimeZone())}
              />
              <DatePicker
                label="End Date"
                isRequired
                showMonthAndYearPickers
                onChange={(value) => setEndDate(value)}
                defaultValue={now(getLocalTimeZone())}
              />
            </ModalBody>
            <ModalFooter>
              {readOnly ? (
                ""
              ) : (
                <Button color="success" onPress={onSave}>
                  Save
                </Button>
              )}
              <Button color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
