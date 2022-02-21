import type { NextPage } from "next";
import { useEffect, useState, VoidFunctionComponent } from "react";
import Repo from "../components/Repo";
import Navigation from "../components/Navigation";
import { localStorageKey } from "../util/consts";

const FavoritedRepos: VoidFunctionComponent = () => {
  let [favorites, setFavorites] = useState([]);

  useEffect(function FavoritedReposEffect() {
    console.log("effect runngin");
    let favs = localStorage.getItem(localStorageKey);

    if (typeof favs === "string") {
      setFavorites(JSON.parse(favs));
    }
  }, []);

  const removeFavorite = (name: string) => (e: React.MouseEvent) => {
    try {
      e.stopPropagation();
      let favs = localStorage.getItem(localStorageKey);
      if (typeof favs === "string") {
        let favsArr: any[] = JSON.parse(favs);
        let filtered = favsArr.filter((e) => e.name !== name);
        localStorage.setItem(localStorageKey, JSON.stringify(filtered));
        // @ts-ignore
        setFavorites(filtered);
      } else {
        console.log("this isn't a string type");
      }
    } catch (_e) {
      throw new Error("failed to remove favorited repo");
    }
  };

  return (
    <div className="space-y-4">
      {favorites.map(({ name, description, stargazers_count, html_url }, i) => (
        <Repo
          key={i}
          description={description}
          html_url={html_url}
          name={name}
          stargazers_count={stargazers_count}
          isFavorite={true}
          removeFavoriteEvent={removeFavorite(name)}
        />
      ))}
    </div>
  );
};

let Favorites: NextPage = () => {
  return (
    <Navigation>
      <FavoritedRepos />
    </Navigation>
  );
};

export default Favorites;
