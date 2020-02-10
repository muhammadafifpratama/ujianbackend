const express = require("express")
const cors = require("cors")
const bodyparser = require("body-parser")
const mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'afif',
    password: 'asd123',
    database: 'tokokasih'
});

const port = 2000
const app = express()

app.use(cors())
app.use(bodyparser.json())

app.get("/", (req, res) => {
    res.status(202).send("selamat telah masuk tes")
})
//buat munculin semua categories
app.get("/categories/", (req, res) => {
    const query = "select  ca.id,ca.category,c.category as parentname from categories c right join categories ca on c.id = ca.parentid;"
    connection.query(query, (error, results) => {
        if (error) {return res.send(error)}
        res.status(200).send(results)
    });
})
//buat edit categories
app.put("/categories/:id", (req, res) => {
    const query = `update categories set ? where id = ${connection.escape(req.params.id)}`
    connection.query(query, req.body, (error, results) => {
        if (error) {return res.status(500).send(error)}
        res.status(200).send(results)
    })
})
//buat delete categories
app.delete("/categories/:id", (req, res) => {
    const query = `delete from categories where id = ${connection.escape(req.params.id)}`;
    connection.query(query, (err, results) => {
        if (err) {return res.status(500).send(err)}
        res.send(results)
    })
})
//buat add new categories
app.post("/categories", (req, res) => {
    const query = "insert into categories set ?;"
    connection.query(query, req.body, (error, results) => {
        if (error) {return res.status(500).send(error)}
        res.status(200).send(results)
    })
})
//buat munculin semua product
app.get("/product", (req, res) => {
    const query = "select * from products"
    connection.query(query, (error, results) => {
        if (error) {return res.send(error)}
        res.status(200).send(results)
    });
})
//buat edit product
app.put("/product/:id", (req, res) => {
    const query = `update products set ? where id = ${connection.escape(req.params.id)}`
    connection.query(query, req.body, (error, results) => {
        if (error) {return res.status(500).send(error)}
        res.status(200).send(results)
    })
})
//buat delete product
app.delete("/product/:id", (req, res) => {
    const query = `delete from products where id = ${connection.escape(req.params.id)}`;
    connection.query(query, (err, results) => {
        if (err) {return res.status(500).send(err)}
        res.send(results)
    })
})
//buat tambah produk baru 
app.post("/product", (req, res) => {
    const query = "insert into products set ?;"
    connection.query(query, req.body, (error, results) => {
        if (error) 
        {
            console.log(req.body);
            console.log(req.body.asal);
            return res.status(500).send(error)
        }
        res.status(200).send(results)
        
    })
})
//buat isi table manage product categories
app.get("/productcategories", (req, res) => {
    const query = "select pc.id,p.nama,c.category from categories c join productcat pc on c.id = pc.categoryid join products p on p.id = pc.productid;"
    connection.query(query, (error, results) => {
        if (error) {return res.send(error)}
        res.status(200).send(results)
    });
})
//buat delete isi dari table manage product categories
app.delete("/productcategories/:id", (req, res) => {
    const query = `delete from productcat where productid = (select * from (select p.id from categories c join productcat pc on c.id = pc.categoryid join products p on p.id = pc.productid where pc.id = ${req.params.id})as akhirnyaaaaa);`
    connection.query(query, (err, results) => {
        if (err) {return res.status(500).send(err)}
        res.send(results)
    })
})
//buat sambungin product ke categories di table manage product categories
app.post("/productcategories/", (req, res) => {
    const query = `insert into productcat values (null, (select id from products where nama = '${req.body.product}'), (select id from categories where category='${req.body.category}')),(null, (select id from products where nama = '${req.body.product}'), (select parentid from categories where category='${req.body.category}')) `
    connection.query(query, req.body, (error, results) => {
        if (error) {return res.status(500).send(error)}
        res.status(200).send(results)
    })
})
//isi dari manage product categories category box yang paling child saja (leaf node)
app.get("/addcategories/", (req, res) => {
    console.log(req.query);
    const query = "select c.category from categories c left join categories ca on c.id = ca.parentid where ca.category is null;"
    connection.query(query, (error, results) => {
        if (error) {
            return res.send(error)
        }
        res.status(200).send(results)
        console.log(results);
    });
})


app.listen(port, () => console.log(`api sudah aktif di port ${port}`))