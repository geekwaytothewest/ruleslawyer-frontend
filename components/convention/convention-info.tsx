"use client";
import frontendFetch from "@/utilities/frontendFetch";
import { useAuth } from "@/utilities/swr/useAuth";
import React, { useEffect, useState } from "react";
import CollectionCard from "../collection/collection-card";
import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { GrAttachment } from "react-icons/gr";
import usePermissions from "@/utilities/swr/usePermissions";
import ConventionModal from "./convention-modal";
import { FaEdit, FaTrophy, FaUsersCog } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import CollectionModal from "../collection/collection-modal";
import { TbPackageImport } from "react-icons/tb";
import { DateFormatter } from "@internationalized/date";
import { MdAdminPanelSettings, MdOutlineShoppingCartCheckout } from "react-icons/md";

export default function ConventionInfo(props: any) {
  let { id, hideTitle, hideSubtitle } = props;

  const [convention, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);
  const [collectionIdToAttach, setCollectionIdToAttach]: any = useState(null);
  const [collections, setCollections]: any = useState(null);
  const [filteredCollections, setFilteredCollections]: any = useState(null);
  const [readOnly, setReadOnly]: any = useState(true);
  const {
    permissions,
    isLoading: isLoadingPermissions,
    isError,
  }: any = usePermissions();

  const session: any = useAuth();
  const formatter = new DateFormatter("en-US", {
    dateStyle: "full",
    timeStyle: "full",
    timeZone: "America/Chicago",
  });

  useEffect(() => {
    frontendFetch("GET", "/con/" + id, null, session?.data?.token)
      .then((res: any) => res.json())
      .then((data: any) => {
        setData(data);
        setLoading(false);
      })
      .catch((err: any) => {});
  }, [id, session?.data?.token]);

  useEffect(() => {
    if (permissions.user?.data) {
      if (permissions.user.data.superAdmin) {
        setReadOnly(false);
      } else if (convention) {
        if (
          permissions.organizations.data?.filter(
            (d: { organizationId: any; admin: boolean }) =>
              d.organizationId == convention.organizationId && d.admin === true
          ).length > 0
        ) {
          setReadOnly(false);
        } else {
          if (
            permissions.conventions.data?.filter(
              (d: { conventionId: any; admin: boolean }) =>
                d.conventionId == convention.conventionId && d.admin === true
            ).length > 0
          ) {
            setReadOnly(false);
          } else {
            setReadOnly(true);
          }

          setLoading(false);
        }

        setLoading(false);
      } else {
        setReadOnly(true);
      }
    } else {
      setReadOnly(true);
    }
  }, [permissions.user?.data, permissions.organizations?.data, permissions.conventions?.data, convention]);

  useEffect(() => {
    if (convention && !readOnly) {
      frontendFetch(
        "GET",
        "/org/" + convention.organizationId + "/collections",
        null,
        session?.data?.token
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          setCollections(data);
        })
        .catch((err: any) => {});
    }
  }, [convention, session?.data?.token, readOnly]);

  useEffect(() => {
    if (collections) {
      setFilteredCollections(
        collections?.filter(
          (c: { id: any }) =>
            convention.collections.find(
              (c2: { collectionId: any; id: any }) => c2.collectionId == c.id
            ) === undefined
        )
      );
    }
  }, [collections, convention]);

  const onModalClose = () => {
    frontendFetch("GET", "/con/" + id, null, session?.data?.token)
      .then((res: any) => res.json())
      .then((data: any) => {
        setData(data);
      })
      .catch((err: any) => {});
  };

  const onSave = () => {
    frontendFetch(
      "POST",
      "/con/" + id + "/conventionCollection/" + collectionIdToAttach,
      {},
      session?.data?.token
    )
      .then((res: any) => res.json())
      .then((data: any) => {
        onClose();
      })
      .catch((err: any) => {});
  };

  const disclosure = useDisclosure({
    onClose: onModalClose,
  });
  const { isOpen, onOpen, onClose } = disclosure;

  const createCollectionDisclosure = useDisclosure({
    onClose: onModalClose,
  });

  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onClose: onCloseCreate,
  } = createCollectionDisclosure;

  const importCollectionDisclosure = useDisclosure({
    onClose: onModalClose,
  });

  const {
    isOpen: isOpenImport,
    onOpen: onOpenImport,
    onClose: onCloseImport,
  } = importCollectionDisclosure;

  const editDisclosure = useDisclosure({
    onClose: onModalClose,
  });

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = editDisclosure;

  if (isLoading || isLoadingPermissions) return <div>Loading...</div>;

  return (
    <div className="relative flex flex-col sm:flex-row">
      <div className="flex-1">
        <div className="text-gwgreen" hidden={hideTitle && hideSubtitle}>
          <h1 hidden={hideTitle}>{convention.name}</h1>
          <h2 className="mb-8" hidden={hideSubtitle}>
            {convention.theme}
          </h2>
        </div>

        <p>
          <b className="text-gwgreen">Start Date: </b>
          {formatter.format(new Date(convention.startDate))}
        </p>
        <p className="mb-8">
          <b className="text-gwgreen">End Date: </b>
          {formatter.format(new Date(convention.endDate))}
        </p>

        <h3 className="flex">
          <span className="text-gwgreen">
            <b>Collections:</b>
          </span>{" "}
          {readOnly ? (
            ""
          ) : (
            <div className="flex">
              <Tooltip
                content="Create Collection"
                showArrow={true}
                color="success"
                delay={1000}
              >
                <span>
                  <IoMdAddCircle
                    className="ml-2 hover:cursor-pointer hover:text-gwgreen"
                    onClick={onOpenCreate}
                  />
                </span>
              </Tooltip>
              <Tooltip
                content="Import Collection"
                showArrow={true}
                color="success"
                delay={1000}
              >
                <span>
                  {" "}
                  <TbPackageImport
                    className="ml-2 hover:cursor-pointer hover:text-gwgreen"
                    onClick={onOpenImport}
                  />
                </span>
              </Tooltip>
              <Tooltip
                content="Attach Collection"
                showArrow={true}
                color="success"
                delay={1000}
              >
                <span>
                  <GrAttachment
                    className="ml-2 hover:cursor-pointer hover:text-gwgreen"
                    onClick={onOpen}
                  />
                </span>
              </Tooltip>
            </div>
          )}
        </h3>
        {readOnly ? (
          ""
        ) : (
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSave();
                }}
              >
                <ModalHeader>Attach Collection</ModalHeader>
                <ModalBody>
                  <Select
                    name="collectionSelect"
                    items={filteredCollections}
                    label="Collection to Attach"
                    placeholder="Select a collection"
                    isRequired
                    onChange={(event) => {
                      setCollectionIdToAttach(Number(event.target.value));
                    }}
                  >
                    {(collection: any) => (
                      <SelectItem key={collection.id}>
                        {collection.name}
                      </SelectItem>
                    )}
                  </Select>
                </ModalBody>
                <ModalFooter>
                  <Button color="success" type="submit">
                    Attach
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Cancel
                  </Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
        )}
        <div className="flex flex-wrap mr-8">
          {convention.collections.map(
            (c: {
              collection: {
                _count: any;
                id: React.Key | null | undefined;
                name:
                  | string
                  | number
                  | bigint
                  | boolean
                  | React.ReactElement<
                      any,
                      string | React.JSXElementConstructor<any>
                    >
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | null
                  | undefined;
              };
            }) => {
              return (
                <div key={c.collection.id}>
                  <CollectionCard
                    collectionIn={c.collection}
                    conventionId={convention.id}
                    onDeleted={onClose}
                  />
                </div>
              );
            }
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 justify-end mb-8">
        <Tooltip
          content={"Legacy Board Game Admin Frontend"}
          showArrow={true}
          color="success"
          delay={1000}
          classNames={{
            content: "max-w-[125px] text-center"
          }}
        >
          <span className="text-3xl hover:cursor-pointer">
            <Link target="_blank" className="text-3xl text-white hover:text-gwgreen relative inline-flex items-center" href={`${process.env.LEGACY_ADMIN_URL}/org/${String(convention.organizationId)}/con/${String(convention.id)}/admin`}><MdAdminPanelSettings /></Link>
          </span>
        </Tooltip>

        <Tooltip
          content={"Legacy Librarian Frontend"}
          showArrow={true}
          color="success"
          delay={1000}
          classNames={{
            content: "max-w-[125px] text-center"
          }}
        >
          <span className="text-3xl hover:cursor-pointer">
            <Link target="_blank" className="text-3xl text-white hover:text-gwgreen relative inline-flex items-center" href={`${process.env.LEGACY_LIBRARIAN_URL}/org/${String(convention.organizationId)}/con/${String(convention.id)}/librarian`}><MdOutlineShoppingCartCheckout /></Link>
          </span>
        </Tooltip>

        <Tooltip
          content={"Legacy Play Prize Entry Frontend"}
          showArrow={true}
          color="success"
          delay={1000}
          classNames={{
            content: "max-w-[125px] text-center"
          }}
        >
          <span className="text-3xl hover:cursor-pointer">
            <Link target="_blank" className="text-3xl text-white hover:text-gwgreen relative inline-flex items-center" href={`${process.env.LEGACY_PLAY_PRIZE_ENTRY_URL}/org/${String(convention.organizationId)}/con/${String(convention.id)}/playandwin`}><FaTrophy /></Link>
          </span>
        </Tooltip>

        <Tooltip
          content={"User Permissions"}
          showArrow={true}
          color="success"
          delay={1000}
          classNames={{
            content: "max-w-[125px] text-center"
          }}
        >
          <span className="text-3xl hover:cursor-pointer">
            <Link className="text-3xl text-white hover:text-gwgreen relative inline-flex items-center" href={`/dashboard/organization/${String(convention.organizationId)}/convention/${String(convention.id)}/users`}><FaUsersCog /></Link>
          </span>
        </Tooltip>

        {readOnly ? (
          ""
        ) : (
          <Tooltip
            content={"Edit " + convention.name}
            showArrow={true}
            color="success"
            delay={1000}
            classNames={{
              content: "max-w-[125px] text-center"
            }}
          >
            <span className="text-3xl hover:text-gwgreen hover:cursor-pointer relative inline-flex items-center">
              <FaEdit onClick={onOpenEdit} />
            </span>
          </Tooltip>
        )}
      </div>

      <ConventionModal
        conventionIn={convention}
        conventionId={id}
        organizationId={convention.organizationId}
        disclosure={editDisclosure}
      />
      <CollectionModal
        disclosure={createCollectionDisclosure}
        conventionId={convention.id}
        organizationId={convention.organizationId}
      />
      <CollectionModal
        disclosure={importCollectionDisclosure}
        conventionId={convention.id}
        organizationId={convention.organizationId}
        importFile={true}
      />
    </div>
  );
}
