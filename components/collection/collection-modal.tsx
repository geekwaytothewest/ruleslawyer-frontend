"use client";
import frontendFetch from "@/utilities/frontendFetch";
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import usePermissions from "@/utilities/swr/usePermissions";

export default function CollectionModal(props: any) {
  let { collectionIn, collectionId, organizationId, disclosure, conventionId } =
    props;

  const [collection, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);
  const [collectionName, setCollectionName]: any = useState(null);
  const [allowWinning, setAllowWinning]: any = useState(false);
  const [readOnly, setReadOnly]: any = useState(true);

  const {
    permissions,
    isLoading: isLoadingPermissions,
    isError,
  }: any = usePermissions();

  const session: any = useSession();

  const { isOpen, onOpen, onClose } = disclosure;

  const onSave = () => {
    if (collection) {
      frontendFetch(
        "PUT",
        "/collection/" + collection.id,
        {
          name: collectionName,
          allowWinning: allowWinning,
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
        "/org/" + organizationId + "/collections",
        {
          name: collectionName,
          allowWinning: allowWinning,
        },
        session?.data?.token
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          if (conventionId) {
            frontendFetch(
              "POST",
              "/con/" + conventionId + "/conventionCollection/" + data.id,
              {
                name: collectionName,
                allowWinning: allowWinning,
              },
              session?.data?.token
            )
              .then((res: any) => res.json())
              .then((data: any) => {
                onClose();
              })
              .catch((err: any) => {});
          } else {
            onClose();
          }
        })
        .catch((err: any) => {});
    }
  };

  useEffect(() => {
    if (collectionIn) {
      setData(collectionIn);

      setCollectionName(collectionIn.name);
      setAllowWinning(collectionIn.allowWinning);

      setLoading(false);
    } else if (collectionId) {
      frontendFetch(
        "GET",
        "/collection/" + collectionId,
        null,
        session?.data?.token
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);

          setCollectionName(collectionIn.name);
          setAllowWinning(collectionIn.allowWinning);

          setLoading(false);
        })
        .catch((err: any) => {});
    } else {
      setLoading(false);
    }
  }, [collectionId, collectionIn, session?.data?.token]);

  useEffect(() => {
    if (permissions.user) {
      if (collection) {
        if (
          permissions.organizations.data?.filter(
            (d: { organizationId: any; admin: boolean }) =>
              d.organizationId == collection.organizationId && d.admin === true
          ).length > 0
        ) {
          setReadOnly(false);
        } else {
          if (
            permissions.con?.data?.filter(
              (d: { conventionId: any; admin: boolean }) =>
                collection.conventions.filter(
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
  }, [permissions, collection, organizationId]);

  if (isLoading || isLoadingPermissions) return <div></div>;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <div>
            <ModalHeader>
              {collection ? "Edit" : "Create"} Collection
            </ModalHeader>
            <ModalBody>
              <Input
                name="name"
                type="text"
                isRequired
                label="Name"
                value={collectionName}
                onValueChange={(value) => setCollectionName(value)}
                isDisabled={readOnly}
              />
              <Checkbox
                isSelected={allowWinning}
                onValueChange={setAllowWinning}
                isDisabled={readOnly}
              >
                Allow Winning
              </Checkbox>
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
