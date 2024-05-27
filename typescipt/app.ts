import axios from "axios";

const url = "https://jsonplaceholder.typicode.com/todos/1";

interface Result {
    id: number;
    title: string;
}

axios.get(url).then((res) => {
    const todo = res.data as Result;
    const id = todo.id;
    const title = todo.title;

    console.log(`Id:${id}, Title: ${title}`);
}).catch((error) => {
    console.error("Error fetching data:", error);
});
