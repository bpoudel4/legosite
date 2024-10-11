/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Bibek Poudel
*  Student ID: 157056227
*  Date: 2024/10/11
********************************************************************************/

const express = require("express");
const legoData = require("./modules/legoSets");
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

require('pg'); 
const Sequelize = require('sequelize');


app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');


legoData.initialize().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Failed to initialize lego data: ", error);
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/home.html'));
  });
  
  app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));
  });
  

  app.get('/lego/sets', async(req, res) => {
    const theme = req.query.theme;
const data = await legoData.getAllSets();
console.log(data);
    
    try {
        if (theme) {
            const filteredSets = data.filter(set => set.theme.toLowerCase() === theme.toLowerCase());
            if (filteredSets.length > 0) {
                res.json(filteredSets);
            } else {
                res.status(404).send(`No Lego sets found for theme: ${theme}`);
            }
        } else {
            res.json(data);
        }
    } catch (error) {
        res.status(404).send('Error fetching Lego sets');
    }
   
});



app.get('/lego/sets/:set_num', async(req, res) => {
    const setNum = req.params.set_num;
    const data = await legoData.getAllSets(); 

    try {
        const set = data.find(s => s.set_num === setNum);
        if (set) {
            res.json(set);
        } else {
            res.status(404).send(`Lego set with number ${setNum} not found.`);
        }
    } catch (error) {
        res.status(404).send('Error fetching Lego set');
    }
});

  

  app.get('/lego/sets/:id', async(req, res) => {
    const data = await legoData.getSetByNum();
    const set = data.find(set => set.set_num === req.params.id);
    if (set) {
      res.json(set);
    } else {
      res.status(404).send('Lego set not found');
    }
  });
  
  app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
  });
  

// app.get("/", (req, res) => {
//     res.send("Assignment 2: Bibek Poudel - 157056227");
// });

// app.get("/lego/sets", (req, res) => {
//     legoData.getAllSets().then((sets) => {
//         res.json(sets);
//     }).catch((error) => {
//         res.status(500).send(error);
//     });
// });


// app.get("/lego/sets/num-demo", (req, res) => {
//     legoData.getSetByNum("71002-5").then((set) => { 
//         res.json(set);
//     }).catch((error) => {
//         res.status(500).send(error);
//     });
// });


// app.get("/lego/sets/theme-demo", (req, res) => {
//     legoData.getSetsByTheme("Holiday").then((sets) => { 
//         res.json(sets);
//     }).catch((error) => {
//         res.status(500).send(error);
//     });
// });


app.get("/files", (req, res) => {
    const directoryPath = path.join(__dirname, "data"); 

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send("Unable to scan directory: " + err);
        }

        
        res.json(files);
    });
});
