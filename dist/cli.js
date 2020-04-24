#!/usr/bin/env node
"use strict";
/* eslint-disable no-case-declarations */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var clear_1 = __importDefault(require("clear"));
var figlet_1 = __importDefault(require("figlet"));
var process_1 = __importDefault(require("process"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var node_emoji_1 = __importDefault(require("node-emoji"));
var ActivityTypes = [
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
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var username, baseUrl, res, failure, user, res2, repos, languages, res3, activities;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // IIFE Used to get async/await on top level
                clear_1.default();
                console.log(chalk_1.default.rgb(255, 22, 84)(figlet_1.default.textSync("Stalk", {
                    font: "ANSI Shadow",
                }) + chalk_1.default.bold(" v1.0.0")));
                if (process_1.default.argv.length !== 3) {
                    console.log(chalk_1.default.bold("Usage:"));
                    console.log(chalk_1.default.whiteBright("  stalk [username]"));
                    return [2 /*return*/];
                }
                if (["--help", "-h", "--version", "-v"].includes(process_1.default.argv[2])) {
                    console.log(chalk_1.default.bold("Usage:"));
                    console.log(chalk_1.default.whiteBright("  stalk [username]"));
                    return [2 /*return*/];
                }
                username = process_1.default.argv[2];
                baseUrl = "https://api.github.com";
                return [4 /*yield*/, node_fetch_1.default(baseUrl + "/users/" + username)];
            case 1:
                res = _a.sent();
                return [4 /*yield*/, checkResponse(res, chalk_1.default.redBright.bold(node_emoji_1.default.get("anger") + " Shoot! that username does not exist on github"))];
            case 2:
                failure = _a.sent();
                if (failure)
                    return [2 /*return*/];
                return [4 /*yield*/, res.json()];
            case 3:
                user = _a.sent();
                console.log(node_emoji_1.default.get("star") + " " + chalk_1.default.bold.rgb(255, 22, 84)(user.login) + " " + chalk_1.default.rgb(255, 22, 84)(user.name));
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
                return [4 /*yield*/, node_fetch_1.default(baseUrl + "/users/" + username + "/repos")];
            case 4:
                res2 = _a.sent();
                return [4 /*yield*/, checkResponse(res2, chalk_1.default.redBright.bold(node_emoji_1.default.get("anger") + " Shoot! repos not found"))];
            case 5:
                failure = _a.sent();
                if (failure)
                    return [2 /*return*/];
                return [4 /*yield*/, res2.json()];
            case 6:
                repos = _a.sent();
                languages = repos.map(function (repo) { return repo.language; });
                languages = languages.filter(function (a, b) { return languages.indexOf(a) === b; });
                console.log();
                console.log(node_emoji_1.default.get("rainbow") + chalk_1.default.bold.rgb(255, 22, 84)(" Languages"));
                console.log(languages.join(" "));
                return [4 /*yield*/, node_fetch_1.default(baseUrl + "/users/" + username + "/events")];
            case 7:
                res3 = _a.sent();
                return [4 /*yield*/, checkResponse(res2, chalk_1.default.redBright.bold(node_emoji_1.default.get("anger") + " Shoot! activity not found"))];
            case 8:
                failure = _a.sent();
                if (failure)
                    return [2 /*return*/];
                return [4 /*yield*/, res3.json()];
            case 9:
                activities = _a.sent();
                console.log();
                console.log(node_emoji_1.default.get("rocket") + chalk_1.default.bold.rgb(255, 22, 84)(" Activity"));
                activities
                    .filter(function (activity) { return ActivityTypes.includes(activity.type); })
                    .slice(0, 5)
                    .map(function (activity) { return console.log(parseActivity(activity)); });
                return [2 /*return*/];
        }
    });
}); })();
function printPair(left, right) {
    if (right !== null) {
        console.log(chalk_1.default.bold(left) + ": " + right);
    }
}
function beautifyTime(t) {
    return new Date(t).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}
function beautifyDate(s) {
    return new Date(s).toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}
function parseActivity(activity) {
    //set repo url for referencing
    var repo = chalk_1.default.bold.rgb(255, 159, 28)(activity.repo.name);
    switch (activity.type) {
        case "PushEvent":
            var commit = "commit";
            if (activity.payload.size > 1) {
                commit += "s";
            }
            return chalk_1.default.bold("Pushed") + " " + activity.payload.size + " " + commit + " to https://github.com/" + repo;
        case "WatchEvent":
            return chalk_1.default.bold("Starred") + " https://github.com/" + repo;
        case "CreateEvent":
            return chalk_1.default.bold("Created") + " a " + activity.payload.ref_type + " at https://github.com/" + repo;
        case "DeleteEvent":
            return chalk_1.default.bold("Deleted") + " a " + activity.payload.ref_type + " at https://github.com/" + repo;
        case "ForkEvent":
            return chalk_1.default.bold("Forked") + " a repo from " + activity.payload.forkee.html_url;
        case "PullRequestEvent":
            return chalk_1.default.bold(activity.payload.action.charAt(0).toUpperCase() + activity.payload.action.slice(1)) + " a PR in https://github.com/" + repo;
        case "PullRequestReviewCommentEvent":
            return chalk_1.default.bold(activity.payload.action.charAt(0).toUpperCase() + activity.payload.action.slice(1)) + " a comment on a PR in https://github.com/" + repo;
        case "IssuesEvent":
            return chalk_1.default.bold(activity.payload.action.charAt(0).toUpperCase() + activity.payload.action.slice(1)) + " an issue in https://github.com/" + repo;
        case "IssueCommentEvent":
            return chalk_1.default.bold(activity.payload.action.charAt(0).toUpperCase() + activity.payload.action.slice(1)) + " an issue in https://github.com/" + repo;
        case "PublicEvent":
            return chalk_1.default.bold("Made") + " https://github.com/" + repo + " public";
    }
    return "";
}
function checkResponse(res, err) {
    return __awaiter(this, void 0, void 0, function () {
        var lim, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (res.status === 404) {
                        console.log(chalk_1.default.redBright.bold(err));
                        return [2 /*return*/, true];
                    }
                    if (!(res.status === 403)) return [3 /*break*/, 3];
                    return [4 /*yield*/, node_fetch_1.default("https://github.com/rate_limit")];
                case 1:
                    lim = _a.sent();
                    return [4 /*yield*/, lim.json()];
                case 2:
                    err_1 = _a.sent();
                    console.log(chalk_1.default.redBright.bold(node_emoji_1.default.get("anger") + " Shoot! Rate limit exceeded till " +
                        beautifyTime(err_1.resources.core.reset * 1000)));
                    return [2 /*return*/, true];
                case 3:
                    if (res.status !== 200) {
                        console.log(chalk_1.default.redBright.bold(node_emoji_1.default.get("anger") + " Error: " + res.statusText));
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/, false];
            }
        });
    });
}
