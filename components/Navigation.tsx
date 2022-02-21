import { FC } from "react";
import Link from "next/link";

const Navigation: FC = ({ children }) => {
  return (
    <main
      className={
        "grid grid-cols-1 justify-center bg-black text-white mx-auto max-w-7xl space-y-2"
      }
    >
      <nav>
        <ul className="flex space-x-7">
          <li>
            <Link href={"/"}>
              <a className="text-2xl">{"🏠 Home"}</a>
            </Link>
          </li>
          <li>
            <Link href={"/favorites"}>
              <a className="text-2xl">{"🏆 Favorites"}</a>
            </Link>
          </li>
        </ul>
      </nav>
      {children}
    </main>
  );
};

export default Navigation;
