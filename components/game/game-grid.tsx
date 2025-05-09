"use client";
import React, { useEffect, useState } from "react";
import GameCard from "./game-card";
import {
  CircularProgress,
  Input,
  Select,
  SelectItem,
  Selection,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { LuPackageSearch } from "react-icons/lu";
import { useSession } from "next-auth/react";
import frontendFetch from "@/utilities/frontendFetch";
import { IoMdAddCircle } from "react-icons/io";
import CopyModal from "../copy/copy-modal";
import usePermissions from "@/utilities/swr/usePermissions";

export default function GameGrid(props: any) {
  const { collectionId, organizationId, showHeader } = props;

  const [games, setData]: any = useState(null);
  const [header, setHeader]: any = useState("");
  const [searchText, setSearchText]: any = useState("");
  const [isLoading, setLoading]: any = useState(true);
  const [maxResults, setMaxResults] = React.useState<Selection>(new Set([50]));
  const [trigger, setTrigger]: any = useState(0);
  const [readOnly, setReadOnly]: any = useState(true);
  const {
    permissions,
    isLoading: isLoadingPermissions,
    isError,
  }: any = usePermissions();

  const session: any = useSession();

  useEffect(() => {
    if (permissions.user) {
      if (permissions.user.superAdmin) {
        setReadOnly(false);
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
  }, [permissions, organizationId]);

  useEffect(() => {
    if (collectionId) {
      const [limit] = maxResults;

      frontendFetch(
        "GET",
        "/collection/" +
          collectionId +
          "/copiesByGames" +
          "?limit=" +
          limit +
          "&filter=" +
          searchText,
        null,
        session?.data?.token
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          setHeader("Collection: " + data.name);
          setData(data.games);
          setLoading(false);
        })
        .catch((err: any) => {});
    } else {
      const [limit] = maxResults;
      frontendFetch(
        "GET",
        "/game/withCopies?limit=" + limit + "&filter=" + searchText,
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
  }, [session?.data?.token, collectionId, maxResults, searchText, trigger]);

  const onModalClose = () => {
    setTrigger(trigger + 1);
  };

  const createDisclosure = useDisclosure({
    onClose: onModalClose,
  });

  const { onOpen: onOpenCreate } = createDisclosure;

  if (isLoading) {
    return (
      <div className="flex justify-center w-full pt-10">
        <CircularProgress isIndeterminate={true} label="Loading..." />
      </div>
    );
  }

  return (
    <div>
      {showHeader ? <h1>{header}</h1> : ""}
      <div className="flex m-10">
        <Input
          name="search"
          type="text"
          label="Search Games"
          placeholder="Type a game name"
          startContent={<LuPackageSearch />}
          onValueChange={setSearchText}
          className="mr-10"
        />
        <Select
          name="maxResults"
          label="Max Results"
          onSelectionChange={setMaxResults}
          selectedKeys={maxResults}
          className="w-1/3"
        >
          <SelectItem key={50}>
            50 Games
          </SelectItem>
          <SelectItem key={100}>
            100 Games
          </SelectItem>
          <SelectItem key={500}>
            500 Games
          </SelectItem>
          <SelectItem key={1000}>
            1000 Games
          </SelectItem>
          <SelectItem key={"All"}>
            All Games
          </SelectItem>
        </Select>
      </div>
      <div className="flex flex-wrap">
        {games.map(
          (g: {
            copies: any;
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
          }) => {
            return <GameCard key={g.id} gameIn={g} gameId={g.id} />;
          }
        )}
      </div>

      {readOnly ? (
        ""
      ) : (
        <Tooltip
          content="Create Game"
          showArrow={true}
          color="success"
          delay={1000}
        >
          <span className="text-7xl fixed bottom-8 right-8 hover:text-gwgreen hover:cursor-pointer">
            <IoMdAddCircle onClick={onOpenCreate} />
          </span>
        </Tooltip>
      )}

      <CopyModal
        disclosure={createDisclosure}
        organizationId={organizationId}
      ></CopyModal>
    </div>
  );
}
