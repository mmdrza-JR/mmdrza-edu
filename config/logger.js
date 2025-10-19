import chalk from "chalk";
import dayjs from "dayjs";

const log = (level, message) => {
  const time = dayjs().format("HH:mm:ss");
  const colors = {
    info: chalk.cyan,
    success: chalk.green,
    warn: chalk.yellow,
    error: chalk.red,
  };
  console.log(colors[level](`[${time}] ${level.toUpperCase()} → ${message}`));
};

export const logger = {
  info: (msg) => log("info", msg),
  success: (msg) => log("success", msg),
  warn: (msg) => log("warn", msg),
  error: (msg) => log("error", msg),
};
