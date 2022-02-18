import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState, VoidFunctionComponent } from "react";
import styles from "../styles/Home.module.css";
import { DateTime } from "luxon";

// probs a better name
const localStorageKey = "repos";

type RepoEProps = {
  stargazer_count: number;
  name: string;
};

const RepoE: VoidFunctionComponent<RepoEProps> = ({
  name,
  stargazer_count,
}) => {
  const favorite = (name: string) => {
    return function addFavorite(event: any) {
      console.log(`saving ${name} as favorite`);
      if (!localStorage.getItem(localStorageKey)) {
        localStorage.setItem(localStorageKey, JSON.stringify([{ name }]));
      } else {
        let storedItem = localStorage.getItem(localStorageKey); // it will alwasy be string...
        if (typeof storedItem === "string") {
          let repos = JSON.parse(storedItem);
          repos.push({ name });
          localStorage.setItem(localStorageKey, JSON.stringify(repos));
        }
      }
    };
  };

  return (
    <div onClick={favorite(name)}>
      <div>{name}</div>
      <div>{stargazer_count}</div>
    </div>
  );
};

type Repo = {
  stargazer_count: number;
  name: string;
};

const FavoritedRepos: VoidFunctionComponent = () => {
  let [favorites, setFavorites] = useState([]);

  useEffect(function FavoritedReposEffect() {
    console.log("effect runngin");
    let favs = localStorage.getItem(localStorageKey);

    console.log(`favs is`, favs);
    if (typeof favs === "string") {
      setFavorites(JSON.parse(favs));
    }
  }, []);

  return (
    <div>
      {favorites.map(({ name }, i) => (
        <div key={i}>{`name: ${name}`}</div>
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  let [repos, setRepos] = useState<Repo[]>([]);

  let query = (created: string) =>
    `https://api.github.com/search/repositories?q=created:${created}&sort=stars&order=desc`;

  useEffect(() => {
    async function doEffect() {
      let today = DateTime.now().minus({ week: 1 });

      let pastWeek = today.toISODate();
      let res = await fetch(query(pastWeek));
      if (res.ok) {
        let bod = await res.json();
        console.log(bod);
        // stargazers_count is the star count

        let rez = bod.items.map((e: any) => {
          return {
            stargazer_count: e.stargazers_count,
            name: e.name,
          };
        });

        setRepos(rez);
      } else {
        console.error("there's an error");
      }
    }
    doEffect();
  }, []);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={"grid grid-cols-2"}>
        <div>
          {repos.map(({ stargazer_count, name }, i) => (
            <RepoE key={i} name={name} stargazer_count={stargazer_count} />
          ))}
        </div>
        <div>
          <h3>favorites</h3>
          <FavoritedRepos />
        </div>
      </main>

      {/* <footer>footer</footer> */}
    </div>
  );
};

export default Home;
