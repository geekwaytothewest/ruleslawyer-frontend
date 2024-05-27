"use client";
import React, { useEffect, useState } from "react";
import GameCard from "./game-card";
import {
  CircularProgress,
  Input,
  Select,
  SelectItem,
  Selection,
} from "@nextui-org/react";
import { LuPackageSearch } from "react-icons/lu";
import { useSession } from "next-auth/react";
import frontendFetch from "@/utilities/frontendFetch";

export default function GameGrid(props: any) {
  const { gamesIn, orgId } = props;

  const [games, setData]: any = useState(null);
  const [searchText, setSearchText]: any = useState("");
  const [isLoading, setLoading]: any = useState(true);
  const [maxResults, setMaxResults] = React.useState<Selection>(new Set([50]));

  const session: any = useSession();

  useEffect(() => {}, [session]);

  useEffect(() => {
    if (gamesIn) {
      setData(gamesIn);
      setLoading(false);
    } else {
      const [limit] = maxResults;
      frontendFetch(
        "GET",
        "/game/withCopies?limit=" + limit,
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
  }, [session?.data?.token, gamesIn, maxResults]);

  if (isLoading) {
    return (
      <div className="flex justify-center w-full pt-10">
        <CircularProgress isIndeterminate={true} label="Loading..." />
      </div>
    );
  }

  return (
    <div>
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
          <SelectItem key={50} value={50}>
            50 Games
          </SelectItem>
          <SelectItem key={100} value={100}>
            100 Games
          </SelectItem>
          <SelectItem key={500} value={500}>
            500 Games
          </SelectItem>
          <SelectItem key={1000} value={1000}>
            1000 Games
          </SelectItem>
          <SelectItem key={"All"} value={"All"}>
            All Games
          </SelectItem>
        </Select>
      </div>
      <div className="flex flex-wrap">
        {games
          ?.filter(
            (g: any) =>
              searchText === null ||
              searchText === "" ||
              g.name.toLowerCase().includes(searchText.toLowerCase())
          )
          .slice(0, Array.from(maxResults)[0] ?? 50)
          .map(
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
                | Promise<React.AwaitedReactNode>
                | null
                | undefined;
            }) => {
              return <GameCard key={g.id} gameIn={g} gameId={g.id} />;
            }
          )}
      </div>
    </div>
  );
}
