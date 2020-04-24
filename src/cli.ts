#!/usr/bin/env node
/* eslint-disable no-case-declarations */

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

const ActivityTypes: string[] = [
  "PushEvent",
  "WatchEvent",
  "CreateEvent",
  "DeleteEvent",
  "ForkEvent",
  "PullRequestEvent",
  "PullRequestReviewCommentEvent",
  "IssuesEvent",
  "IssueCommentEvent",
  "PublicEvent",
];

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
      }) + chalk.bold(" v1.0.0")
    )
  );
  if (process.argv.length !== 3) {
    console.log(chalk.bold("Usage:"));
    console.log(chalk.whiteBright("  stalk [username]"));
    return;
  }

  if (["--help", "-h", "--version", "-v"].includes(process.argv[2])) {
    console.log(chalk.bold("Usage:"));
    console.log(chalk.whiteBright("  stalk [username]"));
    return;
  }

  const username: string = process.argv[2];
  const baseUrl = "https://api.github.com";

  const res = await fetch(`${baseUrl}/users/${username}`);

  let failure = await checkResponse(
    res,
    chalk.redBright.bold(`${emoji.get("anger")} Shoot! that username does not exist on github`)
  );
  if (failure) return;

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
  printPair("Joined", beautifyDate(user.created_at));
  printPair("Looking for a job?", user.hireable ? "Yes" : "No");
  printPair("Repos", user.public_repos.toString());
  printPair("Followers", user.followers.toString());
  printPair("Following", user.following.toString());

  const res2 = await fetch(`${baseUrl}/users/${username}/repos`);

  failure = await checkResponse(
    res2,
    chalk.redBright.bold(`${emoji.get("anger")} Shoot! repos not found`)
  );
  if (failure) return;

  const repos: { [key: string]: any }[] = await res2.json();

  let languages = repos.map((repo) => repo.language);
  languages = languages.filter((a, b) => languages.indexOf(a) === b);

  console.log();
  console.log(emoji.get("rainbow") + chalk.bold.rgb(255, 22, 84)(" Languages"));
  console.log(languages.join(" "));

  const res3 = await fetch(`${baseUrl}/users/${username}/events`);

  failure = await checkResponse(
    res2,
    chalk.redBright.bold(`${emoji.get("anger")} Shoot! activity not found`)
  );
  if (failure) return;

  const activities: { [key: string]: any }[] = await res3.json();

  console.log();
  console.log(emoji.get("rocket") + chalk.bold.rgb(255, 22, 84)(" Activity"));

  activities
    .filter((activity) => ActivityTypes.includes(activity.type))
    .slice(0, 5)
    .map((activity) => console.log(parseActivity(activity)));
})();

function printPair(left: string, right: string) {
  if (right !== null) {
    console.log(`${chalk.bold(left)}: ${right}`);
  }
}

function beautifyTime(t: number): string {
  return new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function beautifyDate(s: string): string {
  return new Date(s).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function parseActivity(activity: { [key: string]: any }): string {
  //set repo url for referencing
  const repo = chalk.bold.rgb(255, 159, 28)(activity.repo.name);
  switch (activity.type) {
    case "PushEvent":
      let commit = "commit";
      if (activity.payload.size > 1) {
        commit += "s";
      }
      return `${chalk.bold("Pushed")} ${
        activity.payload.size
      } ${commit} to https://github.com/${repo}`;
    case "WatchEvent":
      return `${chalk.bold("Starred")} https://github.com/${repo}`;
    case "CreateEvent":
      return `${chalk.bold("Created")} a ${
        activity.payload.ref_type
      } at https://github.com/${repo}`;
    case "DeleteEvent":
      return `${chalk.bold("Deleted")} a ${
        activity.payload.ref_type
      } at https://github.com/${repo}`;
    case "ForkEvent":
      return `${chalk.bold("Forked")} a repo from ${activity.payload.forkee.html_url}`;
    case "PullRequestEvent":
      return `${chalk.bold(
        activity.payload.action.charAt(0).toUpperCase() + activity.payload.action.slice(1)
      )} a PR in https://github.com/${repo}`;
    case "PullRequestReviewCommentEvent":
      return `${chalk.bold(
        activity.payload.action.charAt(0).toUpperCase() + activity.payload.action.slice(1)
      )} a comment on a PR in https://github.com/${repo}`;
    case "IssuesEvent":
      return `${chalk.bold(
        activity.payload.action.charAt(0).toUpperCase() + activity.payload.action.slice(1)
      )} an issue in https://github.com/${repo}`;
    case "IssueCommentEvent":
      return `${chalk.bold(
        activity.payload.action.charAt(0).toUpperCase() + activity.payload.action.slice(1)
      )} an issue in https://github.com/${repo}`;
    case "PublicEvent":
      return `${chalk.bold("Made")} https://github.com/${repo} public`;
  }
  return "";
}

async function checkResponse(res: any, err: string): Promise<boolean> {
  if (res.status === 404) {
    console.log(chalk.redBright.bold(err));
    return true;
  }
  if (res.status === 403) {
    const lim = await fetch(`https://github.com/rate_limit`);
    const err = await lim.json();
    console.log(
      chalk.redBright.bold(
        `${emoji.get("anger")} Shoot! Rate limit exceeded till ` +
          beautifyTime(err.resources.core.reset * 1000)
      )
    );
    return true;
  }
  if (res.status !== 200) {
    console.log(chalk.redBright.bold(`${emoji.get("anger")} Error: ${res.statusText}`));
    return true;
  }
  return false;
}
