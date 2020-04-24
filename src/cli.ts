#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import process from "process";
import fetch from "node-fetch";
import emoji from "node-emoji";

type User = {
  login: string;
  html_url: string;
  name: string;
  bio: string;
  company: string;
  email: string;
  location: string;
  blog: string;
  hireable: boolean;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
};

(async () => {
  // IIFE Used to get async/await on top level
  clear();
  console.log(
    chalk.rgb(
      255,
      22,
      84
    )(
      figlet.textSync("Stalk", {
        font: "ANSI Shadow",
      })
    )
  );
  if (process.argv.length !== 3) {
    console.log(chalk.bold("Usage:"));
    console.log(chalk.whiteBright("  stalk [username]"));
    return;
  }

  if (["--help", "-h"].includes(process.argv[2])) {
    console.log(chalk.bold("Usage:"));
    console.log(chalk.whiteBright("  stalk [username]"));
    return;
  }

  const username: string = process.argv[2];
  const baseUrl = "https://api.github.com";

  const res = await fetch(`${baseUrl}/users/${username}`);

  if (res.status === 404) {
    console.log(
      chalk.redBright.bold(`${emoji.get("anger")} Shoot! that username does not exist on github`)
    );
    return;
  }
  if (res.status !== 200) {
    console.log(chalk.redBright.bold(`${emoji.get("anger")} Error: ${res.statusText}`));
    return;
  }

  const user: User = await res.json();

  console.log(
    `${emoji.get("star")} ${chalk.bold.rgb(255, 22, 84)(user.login)} ${chalk.rgb(
      255,
      22,
      84
    )(user.name)}`
  );
  console.log(user.html_url);
  printPair("Bio", user.bio);
  printPair("Location", user.location);
  printPair("Works At", user.company);
  printPair("Blog", user.blog);
  printPair("Joined", user.created_at);
  printPair("Looking for a job?", user.hireable ? "Yes" : "No");
  printPair("Repos", user.public_repos.toString());
  printPair("Followers", user.followers.toString());
  printPair("Following", user.following.toString());
})();

function printPair(left: string, right: string) {
  if (right !== null) {
    console.log(`${chalk.bold.green(left)}: ${right}`);
  }
}
