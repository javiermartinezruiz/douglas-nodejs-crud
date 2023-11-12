import express from "express"
import bodyParser from "body-parser"
import { readFile } from 'fs/promises'
import { uuid } from "uuidv4"

const json = JSON.parse(
    await readFile(
        new URL('./data.json', import.meta.url)
    )
)
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())


app.get("/getusers", (request, response) => {
    return response.json(json.results)
})

app.get("/getuser/:id", (request, response) => {
    const id = request.params.id
    const user = json.results.find(r => r.id === id)
    if (user === undefined) {
        return response.status(404).json({ "message": `User with id ${request.params?.id} not found!` })
    }
    return response.json(user)
})

app.get("/getrandomuser", (request, response) => {
    const randomId = Math.floor(Math.random() * json.results.length)
    return response.json(response.json(json.results[randomId]))
})

app.post("/newuser", (request, response) => {

    if (request.body === undefined) {
        return response.status(400).json({ "message": "Invalid body!" })
    }

    if (request.body.name === undefined) {
        return response.status(400).json({ "message": "Invalid name!" })
    }

    if (request.body.email === undefined) {
        return response.status(400).json({ "message": "Invalid email!" })
    }

    const user = {
        id: uuid(),
        name: request.body?.name,
        email: request.body?.email
    }
    json.results.push(user)
    return response.status(201).json(user)
})

app.put("/user/:id", (request, response) => {

    if (request.body === undefined) {
        return response.status(400).json({ "message": "Invalid body!" })
    }

    if (request.body.name === undefined) {
        return response.status(400).json({ "message": "Invalid name!" })
    }

    if (request.body.email === undefined) {
        return response.status(400).json({ "message": "Invalid email!" })
    }

    const user = json.results.find(u => u.id === request.params?.id)
    if (user === undefined) {
        return response.status(404).json({ "message": `User with id ${request.params?.id} not found!` })
    }
    user.name = request.body.name
    user.email = request.body.email
    return response.status(200).json(user)
})

app.delete("/user/:id", (request, response) => {
    const filtered = json.results.filter(u => u.id === request.params?.id)
    if (filtered.length === 0) {
        return response.status(404).json({ "message": `User with id ${request.params?.id} not found!` })
    }

    json.results = json.results.filter(u => !(u.id === request.params?.id))
    return response.status(200).json({ "message": `User with id ${request.params?.id} deleted successfully!` })
})


app.get("/*", (request, response) => {
    return response.status(400).json({ "message": "Bad request!" })
})

app.listen(port, () => {
    console.log("Express is running...")
})