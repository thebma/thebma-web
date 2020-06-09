const fs = require("fs")
const http = require("http")
const path = require("path")
const express = require("express")
const handlebars = require("handlebars")

const domains = require("./domains")

const app = express();
const server = http.createServer(app);
const port = 3001;

function resolveDomainAndPage(req, res)
{
    let url = req.headers.host;
    let domain = domains.getDomain(url);

    let includePath = path.join(__dirname, "domains", domain.endpoint, "index.html");

    if(!domain.domain.includes("portfolio"))
    {
        console.log(`include ${includePath}`)
        if(domain !== null)
        {
            //TODO(bma): Cache the result.
            fs.readFile(includePath, (error, data) => {
                if(error) {
                    console.log("Failed to render " + includePath)
                    return
                }
    
                let src = data.toString();
                res.status(200).send(src);
            });
        }
        res.status(404);
        return;
    }
    else
    {
        const contentProm = new Promise((resolved, rejected) => 
        {
            fs.readFile(includePath, (err, data) =>
            {
                if(err)
                {
                    rejected(err);
                }
                else
                {
                    resolved(data.toString());
                }
            });
        })
        .then((data) =>
        {
            const templatingFunc = handlebars.compile(data);
            const templateContent = templatingFunc({
                PAGE_NAME: "portfolio!"
            }); //TODO(bma): pass in context.

            res.status(200).send(templateContent);

        })
        .catch((error) => 
        {
            res.status(500).send("Failed to read contents of page.")
        });

    }

}

app.use("/static", express.static("/public"));
app.get("*", (req, res) => resolveDomainAndPage(req, res));
server.listen(port, () => console.log("Server is running..."));