"use client";
import React, { useEffect, useState } from "react";
import GameCard from "./game-card";
import {
  Button,
  CircularProgress,
  Input,
  Select,
  SelectItem,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { LuPackageSearch } from "react-icons/lu";
import { useAuth } from "@/utilities/swr/useAuth";
import frontendFetch from "@/utilities/frontendFetch";
import { IoMdAddCircle } from "react-icons/io";
import CopyModal from "../copy/copy-modal";
import usePermissions from "@/utilities/swr/usePermissions";

export default function GameGrid(props: any) {
  const { collectionId, organizationId, showHeader } = props;

  const [games, setData]: any = useState(null);
  const [header, setHeader]: any = useState("");
  const [searchText, setSearchText]: any = useState("");
  const [debouncedSearch, setDebouncedSearch]: any = useState("");
  const [isLoading, setLoading]: any = useState(true);
  const [maxResults, setMaxResults] = React.useState<string>("50");
  const [trigger, setTrigger]: any = useState(0);
  const [readOnly, setReadOnly]: any = useState(true);
  const {
    permissions,
    isLoading: isLoadingPermissions,
    isError,
  }: any = usePermissions();

  const session: any = useAuth();

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
    const timer = setTimeout(() => setDebouncedSearch(searchText), 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    const token = session?.data?.token;
    if (!token) return;

    if (collectionId) {
      frontendFetch(
        "GET",
        "/collection/" +
          collectionId +
          "/copiesByGames" +
          "?orgId=" + organizationId +
          "&limit=" + maxResults +
          "&filter=" + debouncedSearch,
        null,
        token
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          setHeader("Collection: " + data.name);
          setData(data.games);
          setLoading(false);
        })
        .catch(() => {});
    } else {
      frontendFetch(
        "GET",
        "/game/withCopies" +
          "?orgId=" + organizationId +
          "&limit=" + maxResults +
          "&filter=" + debouncedSearch,
        null,
        token
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);
          setLoading(false);
        })
        .catch(() => {});
    }
  }, [session?.data?.token, collectionId, maxResults, debouncedSearch, trigger]);

  useEffect(() => {
    const interval = setInterval(() => setTrigger((t: number) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

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
          onSelectionChange={(keys) => {
            if (keys === "all") return;
            const [first] = keys;
            if (first !== undefined) setMaxResults(String(first));
          }}
          selectedKeys={new Set([maxResults])}
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
