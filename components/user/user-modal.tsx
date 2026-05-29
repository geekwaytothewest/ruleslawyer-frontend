"use client";
import frontendFetch from "@/utilities/frontendFetch";
import {
  addToast,
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
    onSaved,
    userType,
  } = props;

  const [user, setData]: any = useState(null);
  const [userAdmin, setUserAdmin]: any = useState(false);
  const [userGeekGuide, setUserGeekGuide]: any = useState(false);
  const [userReadOnly, setUserReadOnly]: any = useState(false);
  const [userAttendee, setUserAttendee]: any = useState(false);
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
    if (userType === "organization") {
      frontendFetch(
        "PUT",
        "/userOrgPerm/" + user.id,
        {
            admin: userAdmin,
            geekGuide: userGeekGuide,
            readOnly: userReadOnly,
        },
        session?.data?.token
      )
      .then((res: any) => {
          if (!res.ok) {
              addToast({
                  title: "Unable to save",
                  description:
                      res.status === 403
                          ? "You don't have permission to edit this user."
                          : "Something went wrong saving your changes.",
                  color: "danger",
              });
              return;
          }
          onSaved?.({
              admin: userAdmin,
              geekGuide: userGeekGuide,
              readOnly: userReadOnly,
          });
          onClose();
        })
        .catch((err: any) => {
            addToast({
                title: "Unable to save",
                description: "Could not reach the server. Please try again.",
                color: "danger",
            });
        });
    } else if (userType === "convention") {
      frontendFetch(
        "PUT",
        "/userConPerm/" + user.id,
        {
            admin: userAdmin,
            geekGuide: userGeekGuide,
            attendee: userAttendee,
        },
        session?.data?.token
      )
      .then((res: any) => {
          if (!res.ok) {
              addToast({
                  title: "Unable to save",
                  description:
                      res.status === 403
                          ? "You don't have permission to edit this user."
                          : "Something went wrong saving your changes.",
                  color: "danger",
              });
              return;
          }
          onSaved?.({
              admin: userAdmin,
              geekGuide: userGeekGuide,
              attendee: userAttendee,
          });
          onClose();
        })
        .catch((err: any) => {
            addToast({
                title: "Unable to save",
                description: "Could not reach the server. Please try again.",
                color: "danger",
            });
        });
    }
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
    if (user && isOpen) {
      setUserAdmin(user.admin ?? false);
      setUserGeekGuide(user.geekGuide ?? false);
      setUserReadOnly(user.readOnly ?? false);
      setUserAttendee(user.attendee ?? false);
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (permissions.user?.data) {
      if (permissions.user.data.superAdmin) {
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
  }, [permissions.user?.data, permissions.organizations?.data, user, organizationId]);

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
                User Editor - {user?.user?.name ?? "New User"}
              </ModalHeader>
              <ModalBody>
                {userType === "organization" ? (
                  <div>
                    <Checkbox
                      isSelected={userAdmin}
                      onValueChange={setUserAdmin}
                      isDisabled={readOnly}
                    >
                      Admin
                    </Checkbox>
                    <br/><br/>
                    <Checkbox
                      isSelected={userGeekGuide}
                      onValueChange={setUserGeekGuide}
                      isDisabled={readOnly}
                    >
                      Geek Guide
                    </Checkbox>
                    <br/><br/>
                    <Checkbox
                      isSelected={userReadOnly}
                      onValueChange={setUserReadOnly}
                      isDisabled={readOnly}
                    >
                      Read Only
                    </Checkbox>
                  </div>
                ) : (
                  <div></div>
                )}

                {userType === "convention" ? (
                  <div>
                    <Checkbox
                      isSelected={userAdmin}
                      onValueChange={setUserAdmin}
                      isDisabled={readOnly}
                    >
                      Admin
                    </Checkbox>
                    <br/><br/>
                    <Checkbox
                      isSelected={userGeekGuide}
                      onValueChange={setUserGeekGuide}
                      isDisabled={readOnly}
                    >
                      Geek Guide
                    </Checkbox>
                    <br/><br/>
                    <Checkbox
                      isSelected={userAttendee}
                      onValueChange={setUserAttendee}
                      isDisabled={readOnly}
                    >
                      Attendee
                    </Checkbox>
                  </div>
                ) : (
                  <div></div>
                )}
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
