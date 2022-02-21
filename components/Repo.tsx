import Link from "next/link";
import React, { VoidFunctionComponent } from "react";

export type Repo = {
  stargazers_count: number;
  name: string;
  html_url: string;
  description: string;
};

const Repo: VoidFunctionComponent<
  Repo & {
    isFavorite?: boolean;
    removeFavoriteEvent?: any;
    addFavoriteEvent?: any;
  }
> = ({
  name,
  stargazers_count,
  html_url,
  description,
  isFavorite,
  removeFavoriteEvent,
  addFavoriteEvent,
}) => {
  return (
    <div className="grid grid-cols-2 grid-rows-3 border-4 border-white items-center relative p-2 rounded">
      <p className="font-semibold text-5xl grid-col row-span-1">{name}</p>
      <div>{`⭐️ ${stargazers_count}`}</div>
      <Link href={html_url}>
        <a className="underline"> {"🔗 Go To Repo"}</a>
      </Link>
      <p className="col-start-2 row-span-full">{description}</p>
      {isFavorite ? (
        <button
          onClick={removeFavoriteEvent}
          className="absolute right-2 top-2"
        >
          {"❌"}
        </button>
      ) : (
        <button
          onClick={addFavoriteEvent}
          className="absolute right-2 top-2 text-xl"
        >
          {"❤️"}
        </button>
      )}
    </div>
  );
};
export default Repo;
