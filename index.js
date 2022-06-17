const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.json())

app.get("/", async (req, res)=>{
    const UserName = await  req.query.name//получаю логин пользователя, через параметры запроса
    const sort = await  req.query.sort//получаю метод сортировки через параметры запроса
    let dataIssueRes = []
    let issue = "no repost"
    await  fetch("https://api.github.com/users/" + UserName+ "/repos")//запрос на получение всех репозиториев пользователя
        .then(Response => Response.json())
        .then(data => {
              for (let i =0; i<data.length;i++)//пробегаемся по репозиториям пользователя
                if (data[i].open_issues_count) dataIssueRes.push(data[i].name)//проверяю на то, что есть issue 
            }
        )
        .catch(err => console.log(err))
    if (dataIssueRes.length){//проверяю есть ли репозиторий с issue
        let repos = dataIssueRes[getRandomInt(dataIssueRes.length)]
        issue = "Репозиторий "+ repos
        await fetch("https://api.github.com/repos/" + UserName + "/" +repos+ "/issues?sort=" + sort)//запрос на получение всех issue выбранного репозитория
        .then(Response => Response.json())
        .then(data => {
            for (let i = 0;i<data.length;i++){//пробегаемся по issue
                if (!data[i].pull_request)//проверка на то, что не pull reques
                issue += "<br>Вопрос :" + data[i].title + "<br>Кол-во комментарие: " + data[i].comments + "<br>Дата создания: " +data[i].created_at+ "<br>Дата последнего редактирования: " +data[i].updated_at+"<hr>"
            }
        })
        .catch(err => console.log(err))
    }
    res.send(issue);//вывожу название,количество коментарие, дату создания и посленнего обнавленния всех issue репозитория
}
);

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

app.listen(3000,()=>console.log("server started"));