import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import Navigation from "../components/Navigation";
import Repo from "../components/Repo";
import type { Repo as RepoType } from "../components/Repo";
import { localStorageKey } from "../util/consts";

const Home: NextPage = () => {
  let [repos, setRepos] = useState<RepoType[]>([]);
  let [page, setPage] = useState(1);
  let [error, setError] = useState<string | null>(null);
  let [update, setUpdate] = useState(false);
  let [language, setLanguage] = useState("");

  let query = (created: string, page: number, langauge?: string) =>
    `https://api.github.com/search/repositories?q=${encodeURIComponent(
      `created:>=${created}${language ? ` language:${language}` : ""}`
    )}&sort=stars&order=desc&page=${page}`;

  useEffect(() => {
    let getRepos = async function (page: number) {
      try {
        let pastWeek = DateTime.now().minus({ week: 1 }).toISODate();
        let res = await fetch(
          query(pastWeek, page, language.length != 0 ? language : undefined)
        );
        if (res.ok) {
          let bod = await res.json();
          let rez = bod.items.map((e: any) => {
            return {
              stargazers_count: e.stargazers_count,
              name: e.name,
              description: e.description,
              html_url: e.html_url,
            };
          });
          setRepos(rez);
        } else {
          throw new Error("the response wasn't 200");
        }
      } catch (e) {
        if (e instanceof Error) setError(e.message);
      }
    };
    getRepos(page);
  }, [page, update, language]);

  let addFavorite =
    (
      name: string,
      stargazers_count: number,
      html_url: string,
      description: string
    ) =>
    (event: React.MouseEvent) => {
      console.debug(`saving ${name} as favorite`);
      if (!localStorage.getItem(localStorageKey)) {
        localStorage.setItem(
          localStorageKey,
          JSON.stringify([{ name, stargazers_count, html_url, description }])
        );
      } else {
        let storedItem = localStorage.getItem(localStorageKey);
        if (typeof storedItem === "string") {
          let repos = JSON.parse(storedItem);
          repos.push({
            stargazers_count,
            html_url,
            description,
            name,
          });
          localStorage.setItem(localStorageKey, JSON.stringify(repos));
        }
      }
      setUpdate(!update);
    };

  return (
    <div className="bg-black">
      <Head>
        <title>new popular github repos</title>
        <meta name="description" content="popular github repos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation>
        {error ? (
          <p className="text-center text-2xl text-red-500">{`${error} please reload the page`}</p>
        ) : (
          <>
            <div className="space-y-4">
              <h1 className="text-6xl text-center">
                Popluar Github Repos last 7 days
              </h1>

              <select
                className="bg-black"
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="">pick lang</option>
                <option value="javascript">javascript</option>
                <option value="typescript">typescript</option>
                <option value="rust">Rust</option>
                <option value="clojure">Clojure</option>
                <option value="java">Java</option>
              </select>

              {repos.map(
                ({ stargazers_count, name, description, html_url }, i) => (
                  <Repo
                    key={i}
                    name={name}
                    stargazers_count={stargazers_count}
                    description={description}
                    html_url={html_url}
                    isFavorite={
                      localStorage.getItem(localStorageKey) &&
                      // @ts-ignore
                      JSON.parse(localStorage.getItem(localStorageKey)).find(
                        (e) => e.name === name
                      )
                    }
                    addFavoriteEvent={addFavorite(
                      name,
                      stargazers_count,
                      html_url,
                      description
                    )}
                  />
                )
              )}
            </div>
            <div className="flex space-x-3 justify-center">
              <button
                className="border-2 border-white rounded p-8"
                onClick={() => {
                  setPage(page - 1 >= 1 ? page - 1 : 1);
                }}
              >
                Prev
              </button>
              <button
                className="border-2 border-white rounded p-8"
                onClick={() => {
                  setPage(page + 1 <= 34 ? page + 1 : 34);
                }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </Navigation>
    </div>
  );
};

export default Home;
