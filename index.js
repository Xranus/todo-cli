import chalk from "chalk"
import figlet from "figlet"
import { stdin, stdout } from "process"
import readline from "readline"
import  fs  from "fs"
import path from "path"
import { fileURLToPath } from "url"
import Table from "cli-table"

const rl = readline.createInterface({
    input: stdin,
    output: stdout
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const fileName = "ToDo.txt"
const filePath = path.join(__dirname, fileName)
const todoData = () => fs.readFileSync(filePath, 'utf-8')

const handleAddTask = (arg) => {
    if(todoData()){
        fs.appendFileSync(filePath, `\n${arg}`, 'utf-8')
    }else{
        fs.writeFileSync(filePath, arg, 'utf-8')        
    }
    console.log(chalk.greenBright("\n<=== Successfully added the task ===>"))
    cliOptions()
}



const handleShowTask = () => {
    if(todoData()){
        const data = todoData().split('\n')
        const table = new Table({
            head: ['No', "Tasks"],
            colWidths: [5, 70]
        })
        let temp = data
        temp.forEach((el,i) => {
            table.push([i+1,el])
        })
        console.log(chalk.whiteBright(table.toString()))
        cliOptions()
    }else{
        console.log(chalk.italic.bgWhite.blackBright("Your todo list is empty :("))
        cliOptions()
    }
}

const handleDelete = (arg) => {
    let data = todoData().split('\n')
    if(arg <= data.length && arg){
        data = data.filter((_, i) => {
            return i+1 != arg
        })
    fs.writeFileSync(filePath, data.join('\n'), 'utf-8')
    console.log(chalk.greenBright("\n<=== Successfully deleted the task ===>"))
    }else if(arg){
        console.log(chalk.bgBlackBright.white("\nInvalid Input. Try again"))
    }else{
        console.log(chalk.italic.greenBright("\n<=== Successfully terminated by default ===>"))
    }
    cliOptions()
}

const handleExit = () => {
    console.log(chalk.redBright("\n<=== Exiting... ===>"))
    rl.close()
}

const handleAnswers = (res) => {
    switch (res) {
        case "1":
            rl.question(chalk.cyan("Enter the task: ") + " ", handleAddTask)
            break;
        case "2":
            handleShowTask()
            break;
        case "3":
            rl.question(chalk.bgRed.yellowBright("Index of the deleting task? (Default: exit)") + "  ", handleDelete)
            break;
        case "4":
            handleExit()
            break
        default:
            console.log(chalk.bgBlackBright.white("\nInvalid Input. Try again"))
            cliOptions()
            break;
    }
}
const cliOptions = () => {
    console.log(
        chalk.green(
            "\n1. Add Task",
            "\n2. Show saved tasks"
        ),chalk.redBright('\n3. Delete a task'),
        chalk.red('\n4. Exit')
    )
    rl.question(chalk.yellowBright("Choose an index from above (1,2,3,4): "), handleAnswers)
} 

console.log(chalk.cyanBright(figlet.textSync("Todo CLI", "3D-ASCII")))
cliOptions()

