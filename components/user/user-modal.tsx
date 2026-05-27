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
} from "@heroui/react";
import { useAuth } from "@/utilities/swr/useAuth";
import React, { useEffect, useState } from "react";
import usePermissions from "@/utilities/swr/usePermissions";

export default function UserModal(props: any) {
  let {
    userIn,
    organizationId,
    disclosure,
    userId,
  } = props;

  const [user, setData]: any = useState(null);
  const [userAdmin, setUserAdmin]: any = useState(false);
  const [userGeekGuide, setUserGeekGuide]: any = useState(false);
  const [userReadOnly, setUserReadOnly]: any = useState(false);
  const [isLoading, setLoading]: any = useState(true);
  const [readOnly, setReadOnly]: any = useState(true);

  const {
    permissions,
    isLoading: isLoadingPermissions,
    isError,
  }: any = usePermissions();

  const session: any = useAuth();

  const { isOpen, onOpen, onClose } = disclosure;

  const onSave = () => {
    frontendFetch(
    "PUT",
    "/userOrgPerm/" + user.id,
    {
        admin: user.admin,
        geekGuide: user.geekGuide,
        readOnly: user.readOnly,
    },
    session?.data?.token
    )
    .then((res: any) => res.json())
    .then((data: any) => {
        onClose();
    })
    .catch((err: any) => {});
  };

  useEffect(() => {
    if (userIn) {
      setData(userIn);

      setLoading(false);
    } else if (userId) {
      frontendFetch(
        "GET",
        "/userOrgPerm/" + userId,
        null,
        session?.data?.token
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);

          setLoading(false);
        })
        .catch((err: any) => {});
    } else {
      setLoading(false);
    }
  }, [userId, userIn, session?.data?.token]);

  useEffect(() => {
    if (permissions.user) {
      if (permissions.user.superAdmin) {
        setReadOnly(false);
      } else if (user) {
        if (
          permissions.organizations.data?.filter(
            (d: { organizationId: any; admin: boolean }) =>
              d.organizationId == user.organizationId && d.admin === true
          ).length > 0
        ) {
          setReadOnly(false);
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
    } else {
      setReadOnly(true);
    }
  }, [permissions, user, organizationId]);

  if (isLoading || isLoadingPermissions) return <div></div>;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSave();
            }}
          >
            <div>
              <ModalHeader>
                User Editor - {user ? user.name : "New User"}
              </ModalHeader>
              <ModalBody>
                <Checkbox
                  isSelected={userAdmin}
                  onValueChange={setUserAdmin}
                  isDisabled={readOnly}
                >
                  Admin
                </Checkbox>
                <Checkbox
                  isSelected={userGeekGuide}
                  onValueChange={setUserGeekGuide}
                  isDisabled={readOnly}
                >
                  Geek Guide
                </Checkbox>
                <Checkbox
                  isSelected={userReadOnly}
                  onValueChange={setUserReadOnly}
                  isDisabled={readOnly}
                >
                  Read Only
                </Checkbox>
              </ModalBody>
              <ModalFooter>
                {readOnly ? (
                  ""
                ) : (
                  <Button color="success" type="submit">
                    Save
                  </Button>
                )}
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </div>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
