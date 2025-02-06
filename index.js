import chalk from "chalk"
import figlet from "figlet"
import { stdin, stdout } from "process"
import readline from "readline"
import  fs  from "fs"
import path from "path"
import { fileURLToPath } from "url"

const rl = readline.createInterface({
    input: stdin,
    output: stdout
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const fileName = "ToDo.txt"
const filePath = path.join(__dirname, fileName)

const handleAddTask = (data) => {
    data = "\n" + data
    if(handleShowTask()){
        fs.appendFileSync(filePath, data, 'utf-8')
    }else{
        fs.writeFileSync(filePath, data, 'utf-8')        
    }
    console.log(chalk.greenBright("Successfully added the task"))
    cliOptions()
}


const handleShowTask = () => {
    return fs.readFileSync(filePath, 'utf-8')
}

const handleAnswers = (res) => {
    switch (res) {
        case "1":
            rl.question(chalk.bgGreen.white("Enter the task"), handleAddTask)
            break;
        case "2":
            console.log(chalk.whiteBright(handleShowTask()))
            cliOptions()
            break;
        case "3":
            console.log(chalk.redBright("Exiting..."))
            rl.close()
            break
        default:
            console.log(chalk.redBright("Invalid Input. Try again"))
            cliOptions()
            break;
    }
}
const cliOptions = () => {
    console.log(
        chalk.green(
            "\n1. Add Task",
            "\n2. Show saved tasks"
        ),
        chalk.red('\n3. Exit')
    )
    rl.question(chalk.yellowBright("Choose an index from above (1,2,3): "), handleAnswers)
} 

console.log(chalk.cyanBright(figlet.textSync("Todo CLI", "3D-ASCII")))
cliOptions()

