import chalk from "chalk";
import figlet from "figlet";
import readline from "readline";
import fs, { statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Table from "cli-table";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fileName = "ToDo.txt";
const filePath = path.join(__dirname, fileName);
const todoData = () => fs.readFileSync(filePath, "utf-8");

const handleAddTask = (arg) => {
  if(arg){
    if (todoData()) {
      fs.appendFileSync(filePath, `\n${arg}<:>PENDING`, "utf-8");
    } else {
      fs.writeFileSync(filePath, `${arg}<:>PENDING`, "utf-8");
    }
    console.log(chalk.greenBright("\n<=== Successfully added the task ===>"));
  } else{
    console.log(
      chalk.bgBlackBright.white("\nInvalid Input. Try again")
    );
  }
  cliOptions();
};

const handleUpdateTask = () => {
  rl.question("Enter the index of updating task:", (taskN0) => {
    const data = todoData().split("\n");
    if (taskN0 <= data.length && taskN0) {
      const taskDesc = data[taskN0 - 1].toString().split("<:>")[0];
      const status = data[taskN0 - 1].toString().split("<:>")[1];
      console.log("\nWhat do you wish?");
      console.log(
        chalk.cyan("\n1. Update the content", "\n2. Update the status")
      );
      rl.question("Choose an index from above: ", (choosenAction) => {
        if (choosenAction == 1) {
          rl.question(
            chalk.yellow("Write the updated task: "),
            (updatedTask) => {
              if (updatedTask) {
                data[taskN0 - 1] = updatedTask + "<:>" + status;
                console.log(
                  chalk.greenBright("\n<=== Successfully updated the task ===>")
                );
                fs.writeFileSync(filePath, data.join("\n"), "utf-8");
                cliOptions();
              } else {
                console.log(
                  chalk.bgBlackBright.white("\nInvalid Input. Try again")
                );
                cliOptions();
              }
            }
          );
        } else if (choosenAction == 2) {
          rl.question(
            "Enter 0 for PENDING, else 1 for COMPLETE: ",
            (statusChoice) => {
              if (statusChoice == 0 && status != "PENDING" && statusChoice) {
                data[taskN0 - 1] = taskDesc + "<:>" + "PENDING";
                fs.writeFileSync(filePath, data.join("\n"), "utf-8");
                console.log(
                  chalk.greenBright("\n<=== Successfully updated the task ===>")
                );
              } else if (
                statusChoice == 1 &&
                status != "COMPLETE" &&
                statusChoice
              ) {
                data[taskN0 - 1] = taskDesc + "<:>" + "COMPLETE";
                fs.writeFileSync(filePath, data.join("\n"), "utf-8");
                console.log(
                  chalk.greenBright("\n<=== Successfully updated the task ===>")
                );
              } else {
                console.log(
                  chalk.bgBlackBright.white("\nInvalid Input. Try again")
                );
              }
              cliOptions();
            }
          );
        }
      });
    } else {
      console.log(chalk.bgBlackBright.white("\nInvalid Input. Try again"));
      cliOptions();
    }
  });
};

const handleShowTask = () => {
  if (todoData()) {
    const data = todoData().split("\n");
    const table = new Table({
      head: ["No", "Tasks", "Status"],
      colWidths: [8, 60, 10],
    });
    let temp = data;
    temp.forEach((el, i) => {
      const elSplit = el.split("<:>");
      const status = elSplit[1];
      const taskDesc = elSplit[0];
      if (status === "COMPLETE") {
        table.push([
          chalk.greenBright(i + 1),
          chalk.greenBright(taskDesc),
          chalk.greenBright(status),
        ]);
      } else {
        table.push([i + 1, taskDesc, status]);
      }
    });
    console.log(table.toString());
    cliOptions();
  } else {
    console.log(chalk.italic.bgWhite.blackBright("Your todo list is empty :("));
    cliOptions();
  }
};

const handleDelete = (arg) => {
  let data = todoData().split("\n");
  if (arg <= data.length && arg) {
    data = data.filter((_, i) => {
      return i + 1 != arg;
    });
    fs.writeFileSync(filePath, data.join("\n"), "utf-8");
    console.log(chalk.greenBright("\n<=== Successfully deleted the task ===>"));
  } else if (arg) {
    console.log(chalk.bgBlackBright.white("\nInvalid Input. Try again"));
  } else {
    console.log(
      chalk.italic.greenBright("\n<=== Successfully terminated by default ===>")
    );
  }
  cliOptions();
};

const handleExit = () => {
  console.log(chalk.redBright("\n<=== Exiting... ===>"));
  rl.close();
};

const handleAnswers = (res) => {
  switch (res) {
    case "1":
      rl.question(chalk.cyan("Enter the task: ") + " ", handleAddTask);
      break;
    case "2":
      handleShowTask();
      break;
    case "3":
      handleUpdateTask();
      break;
    case "4":
      if (todoData()) {
        rl.question(
          chalk.bgRed.yellowBright(
            "Index of the deleting task? (Default: exit)"
          ) + "  ",
          handleDelete
        );
      } else {
        console.log(chalk.bgBlackBright.white("\nYour list is already empty"));
        cliOptions();
      }
      break;
    case "5":
      handleExit();
      break;
    default:
      console.log(chalk.bgBlackBright.white("\nInvalid Input. Try again"));
      cliOptions();
      break;
  }
};
const cliOptions = () => {
  console.log(
    chalk.green("\n1. Add Task", "\n2. Show saved tasks", "\n3. Update Task"),
    chalk.redBright("\n4. Delete a task"),
    chalk.red("\n5. Exit")
  );
  rl.question(
    chalk.yellowBright("Choose an index from above (1,2,3,4,5): "),
    handleAnswers
  );
};

console.log(chalk.cyanBright(figlet.textSync("Todo CLI", "3D-ASCII")));
cliOptions();
