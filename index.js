
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const app = express();
const mysql = require("mysql");


const port = process.env.PORT || 5000;

app.use(cors());
// Express 4.0
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));

// Express 3.0
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb' }));
const db = mysql.createPool({
    // host: '127.0.0.1',
    // user: `${process.env.DB_USER}`,
    // password: `${process.env.DB_PASS}`,
    // database: 'pbsofficeinfo',
    // host: 'sql.freedb.tech',
    // user: `${process.env.DB_USER}`,
    // password: `${process.env.DB_PASS}`,
    // database: 'freedb_pbsofficeinfo',
    host: 'db4free.net',
    user: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASS}`,
    database: 'pbsofficeinfo',
});

//import Customer
app.post('/import-csv-cus', async (req, res) => {
    const data = req.body;
    console.log(data)
    var outputData = [];

    const now = new Date();
    for (var i = 0; i < data.length; i++) {
        var input = data[i];
        // var smsAccountNumber=('10'+input.zonal_code+input.bookNo+input.accountNo);
        outputData.push([, input.zonal_code, input.custId, input.bookNo, input.accountNo, input.name, input.father, input.address, input.c_load, input.contactNumber, input.tariffCode, input.meterNumber, ('10' + input.zonal_code + input.bookNo + input.accountNo)]);
    }
    console.log(outputData)
    const sqlInsert =
        "INSERT INTO `consumer` values ?";
    db.query(sqlInsert, [outputData], (err, result) => {
        res.send(result);
    });
})
//import Customer
app.post('/import-csv-arrear', async (req, res) => {
    const data = req.body;
    console.log(data)
    var outputData = [];

    const now = new Date();
    for (var i = 0; i < data.length; i++) {
        var input = data[i];
        // var smsAccountNumber=('10'+input.zonal_code+input.bookNo+input.accountNo);
        outputData.push([, input.zonal_code, input.custId, input.arrBillPeriod, input.arrTotal]);
    }
    console.log(outputData)
    const sqlInsert =
        "INSERT INTO `arrear` values ?";
    db.query(sqlInsert, [outputData], (err, result) => {
        res.send(result);
    });
})
//import bill
app.post('/import-csv', async (req, res) => {
    const data = req.body;
    console.log(data)
    var outputData = [];

    const now = new Date();
    for (var i = 0; i < data.length; i++) {
        var input = data[i];
        // var smsAccountNumber=('10'+input.zonal_code+input.bookNo+input.accountNo);
        outputData.push([, input.zonal_code, input.bookNo, input.accountNo, input.billNo, input.billPeriod, input.load, input.kw, input.kwPeak, input.lpcDate, input.discDate, input.billAmount, input.lpcAmount, input.ArrearAmt, input.totalBill, input.totalBillWithLpc, ('10' + input.zonal_code + input.bookNo + input.accountNo)]);
    }
    const sqlInsert =
        "INSERT INTO `bill` values ?";
    db.query(sqlInsert, [outputData], (err, result) => {
        res.send(result);
    });
})
// console.log(db)
app.get('/', (req, res) => {
    res.send('Working Office Info SQL');
    // console.log(db)
})
// get users  
app.get('/users', async (req, res) => {
    const sqlSelect =
        "SELECT * FROM users";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
});

// get users by zonal
app.get('/usersByzonal/:zonal_code', async (req, res) => {

    const zonal_code = req.params.zonal_code;
    const sqlSelect =
        "SELECT * FROM users where zonal_code=? or zonal_code is null";
    db.query(sqlSelect, [zonal_code], (err, result) => {
        res.send(result);
    });
});

// add User 
app.post('/userAdd', async (req, res) => {

    const displayName = req.body.displayName;
    const trg_id = req.body.trg_id;
    const email = req.body.email;
    const password = req.body.password;
    const designation = req.body.designation;
    const phone = req.body.phone;
    const pbs_code = req.body.pbs_code;
    const zonal_code = req.body.zonal_code;
    const add_by = req.body.add_by;

    const sqlInsert =
        "INSERT INTO users (displayName,trg_id,email,password,designation,phone,pbs_code,zonal_code,add_by) VALUES (?,?,?,?,?,?,?,?,?)";
    db.query(sqlInsert, [displayName, trg_id, email, password, designation, phone, pbs_code, zonal_code, add_by], (err, result) => {
        res.send(result);
    });
});
// add User Google
app.post('/userAddG', async (req, res) => {

    const displayName = req.body.displayName;
    const trg_id = req.body.trg_id;
    const email = req.body.email;
    const password = req.body.password;
    const designation = req.body.designation;
    const phone = req.body.phone;
    const pbs_code = req.body.pbs_code;
    const zonal_code = req.body.zonal_code;
    const add_by = req.body.add_by;

    const sqlInsert =
        "INSERT INTO users (displayName,trg_id,email,password,designation,phone,pbs_code,zonal_code,add_by) VALUES (?,?,?,?,?,?,?,?,?)";
    db.query(sqlInsert, [displayName, trg_id, email, password, designation, phone, pbs_code, zonal_code, add_by], (err, result) => {
        res.send(result);
    });
});
// get single user 
app.get('/user/:phone', async (req, res) => {
    // console.log(req.params.username)
    const phone = req.params.phone;
    const sqlSelect =
        "SELECT * FROM users WHERE phone=(?)";
    db.query(sqlSelect, [phone], (err, result) => {
        res.send(result);
    });
})
// ...

// Signup route
app.post('/signup', (req, res) => {
    const { role, phone, password, smsAccountNumber } = req.body;
    console.log(role, phone, password, smsAccountNumber)
    // Check if the user already exists in the database
    db.query('SELECT * FROM users WHERE phone = ?', [phone], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // If the user does not exist, hash the password and store the user in the database
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ message: 'Server error' });
            }

            db.query('INSERT INTO users (role, phone, password, smsAccountNumber) VALUES (?, ?,?,?)', [role, phone, hashedPassword, smsAccountNumber], (err) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ message: 'Server error' });
                }
                // Generate and sign a JWT
                const token = jwt.sign({ userId: phone }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

                return res.status(200).json({ message: 'Signup successful!Please Login!!!' });
            });
        });
    });
});
// Signup route Employee
app.post('/signupEmp', (req, res) => {
    const { role, trg_id, phone, displayName, designation, email, password } = req.body;
    // console.log(role,trg_id,phone,displayName,designation,email,password)
    // Check if the user already exists in the database
    db.query('SELECT * FROM users WHERE phone = ?', [phone], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // If the user does not exist, hash the password and store the user in the database

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ message: 'Server error' });
            }

            db.query('INSERT INTO users (role, trg_id, phone, displayName, designation, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)', [role, trg_id, phone, displayName, designation, email, hashedPassword], (err) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ message: 'Server error' });
                }

                // Generate and sign a JWT
                const token = jwt.sign({ userId: phone }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

                return res.status(200).json({ message: 'Create User successful!!!' });
            });
        });

    });
});

// ...

// Login route
// app.post('/loginn', (req, res) => {
//   const { phone, password } = req.body;

//   db.query('SELECT * FROM users WHERE phone = ?', [phone], (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       return res.status(500).json({ message: 'Server error' });
//     }

//     if (results.length === 0) {
//       return res.status(401).json({ message: 'User not found' });
//     }

//     const user = results[0];
//     bcrypt.compare(password, user.password, (err, isMatch) => {
//       if (err) {
//         console.error('Error comparing passwords:', err);
//         return res.status(500).json({ message: 'Server error' });
//       }

//       if (!isMatch) {
//         return res.status(401).json({ message: 'Invalid password' });
//       }

//       // If the phone and password match, send a success response
//       return res.status(200).json({ message: 'Login successful' });
//     });
//   });
// });
// Login route
app.post('/login', (req, res) => {
    const { phone, password } = req.body;

    db.query('SELECT * FROM users WHERE phone = ?', [phone], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ message: 'Server error' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            // Generate and sign a JWT
            const token = jwt.sign({ userId: phone }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

            // If the phone and password match, send the JWT as a response
            return res.status(200).json({ message: 'Login successful', token, user });
        });
    });
});

// get Lgin Details 
app.get('/Login', async (req, res) => {
    // console.log(req.query.trg_id);
    // console.log(req.query.password);

    const trg_id = req.query.trg_id;
    const password = req.query.password;
    const sqlSelect =
        "SELECT * FROM users WHERE trg_id=? and password=?";
    db.query(sqlSelect, [trg_id, password], (err, result) => {
        // console.log(result)
        if (result == "") {
            res.send({ valid: "invalid" });
        } else {
            res.send({ valid: "valid" });
        }

    });
})
// get single user  by id
app.get('/userId/:id', async (req, res) => {
    // console.log(req.params.username)
    const id = req.params.id;
    console.log(id);
    const sqlSelect =
        "SELECT * FROM users WHERE id=(?)";
    db.query(sqlSelect, [id], (err, result) => {
        res.send(result);
    });
})

app.put('/user/:id', async (req, res) => {
    // console.log(req.params.username)
    const email = req.body.email;
    const photoURL = req.body.photoURL;
    const designation = req.body.designation;
    const phone = req.body.phone;
    const id = req.params.id;
    const data = [email, photoURL, designation, phone, id];
    console.log(data);
    const sqlInsert =
        `UPDATE users SET email=?,photoURL=?,designation=?,phone=? WHERE id=?`;
    db.query(sqlInsert, data, (err, result) => {
        res.send({ result });
        console.log(result.affectedRows + " record(s) updated");
        // res.send({ err });
    });
})
// Employee Postiong 
app.put('/userPosting/:id', async (req, res) => {
    // console.log(req.params.username)
    const pbs_code = req.body.pbs_code;
    const zonal_code = req.body.zonal_code;
    const displayName = req.body.displayName;
    const designation = req.body.designation;
    const email = req.body.email;
    const phone = req.body.phone;
    const photoURL = req.body.photoURL;
    const trg_id = req.body.trg_id;
    const posted_by = req.body.posted_by;

    const id = req.params.id;
    const data = [pbs_code, zonal_code, displayName, designation, email, phone, photoURL, trg_id, posted_by, id];
    console.log(data);

    const sqlInsert =
        `UPDATE users SET pbs_code=?,zonal_code=?,displayName=?,designation=?,email=?,phone=?,photoURL=?,trg_id=?,posted_by=? WHERE id=?`;
    db.query(sqlInsert, data, (err, result) => {
        res.send({ result });
        console.log(result.affectedRows + " record(s) updated");
        // res.send({ err });
    });
})
// // get single user 
// app.get('/user/:trg_id', async (req, res) => {
//     // console.log(req.params.username)
//     const trg_id = req.params.trg_id;
//     const sqlSelect =
//         "SELECT * FROM users WHERE trg_id=(?)";
//     db.query(sqlSelect, [trg_id], (err, result) => {
//         res.send(result);
//     });
// })
// get Zonal  
app.get('/zonals/:pbs_code', async (req, res) => {
    const pbs_code = req.params.pbs_code;
    const sqlSelect =
        "SELECT * FROM tbl_zonal where pbs_code=?";
    db.query(sqlSelect, [pbs_code], (err, result) => {
        res.send(result);
    });
});
// get CC  
app.get('/ccs/:zonal_code', async (req, res) => {
    const zonal_code = req.params.zonal_code;
    const sqlSelect =
        "SELECT * FROM tbl_cc where zonal_code=?";
    db.query(sqlSelect, [zonal_code], (err, result) => {
        res.send(result);
    });
});
// add book 
app.post('/dnpBookAdd', async (req, res) => {
    // const newBook = req.body;
    // const result = await bookCollection.insertOne(newBook);
    // res.send(result);
    const pbs_code = req.body.pbs_code;
    const zonal_code = req.body.zonal_code;
    const cc_code = req.body.cc_code;
    const bookNo = req.body.bookNo;
    const numberOfConsumer = req.body.numberOfConsumer;
    const numberOfDcConsumer = req.body.numberOfDcConsumer;
    const assign_to = req.body.assign_to;
    const kw = req.body.kw;
    const add_by = req.body.enteredBy;

    const sqlInsert =
        "INSERT INTO book_information (pbs_code,zonal_code,cc_code,bookNo,numberOfConsumer,numberOfDcConsumer,assign_to,kw,add_by) VALUES (?,?,?,?,?,?,?,?,?)";
    db.query(sqlInsert, [pbs_code, zonal_code, cc_code, bookNo, numberOfConsumer, numberOfDcConsumer, assign_to, kw, add_by], (err, result) => {
        res.send(result);
    });

});
// get Books  
app.get('/books', async (req, res) => {
    const sqlSelect =
        "(SELECT book_information.id,book_information.bookNo,book_information.numberOfConsumer,book_information.numberOfDcConsumer,book_information.pbs_code,book_information.zonal_code,book_information.cc_code,users.displayName,users.designation FROM book_information INNER JOIN tbl_pbs ON book_information.pbs_code = tbl_pbs.pbs_code INNER JOIN tbl_zonal ON book_information.zonal_code = tbl_zonal.zonal_code INNER JOIN tbl_cc ON book_information.cc_code = tbl_cc.cc_code INNER JOIN users ON book_information.assign_to = users.trg_id ORDER BY book_information.assign_to DESC)";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
});
// get Books  by zonal
app.get('/booksByzonal/:zonal_code', async (req, res) => {
    const zonal_code = req.params.zonal_code;
    const sqlSelect =
        "(SELECT book_information.id,book_information.bookNo,book_information.numberOfConsumer,book_information.numberOfDcConsumer,book_information.pbs_code,book_information.zonal_code,book_information.cc_code,users.displayName,users.designation FROM book_information INNER JOIN tbl_pbs ON book_information.pbs_code = tbl_pbs.pbs_code INNER JOIN tbl_zonal ON book_information.zonal_code = tbl_zonal.zonal_code INNER JOIN tbl_cc ON book_information.cc_code = tbl_cc.cc_code INNER JOIN users ON book_information.assign_to = users.trg_id where book_information.zonal_code=? ORDER BY book_information.assign_to DESC)";
    db.query(sqlSelect, [zonal_code], (err, result) => {
        res.send(result);
    });
});
// get single Book 
app.get('/bookbyId/:id', async (req, res) => {
    // console.log(req.params.username)
    const id = req.params.id;
    const sqlSelect =

        "SELECT book_information.bookNo,book_information.numberOfConsumer,book_information.numberOfDcConsumer,book_information.kw,book_information.assign_to,book_information.add_by,book_information.assign_to,book_information.pbs_code,book_information.zonal_code,book_information.cc_code FROM book_information INNER JOIN users ON book_information.assign_to = users.trg_id WHERE book_information.id=?";
    db.query(sqlSelect, [id], (err, result) => {
        res.send(result);
    });
})
// get single Book  by bookno
app.get('/book/:bookNo', async (req, res) => {
    const bookNo = req.params.bookNo;
    const sqlSelect =

        "SELECT * FROM book_information  INNER JOIN users ON book_information.assign_to = users.trg_id INNER JOIN tbl_zonal ON book_information.zonal_code = tbl_zonal.zonal_code INNER JOIN tbl_cc ON book_information.cc_code = tbl_cc.cc_code WHERE book_information.bookNo=?";
    db.query(sqlSelect, [bookNo], (err, result) => {
        res.send(result);
    });
})
// Update Book 

app.put('/book/:id', async (req, res) => {
    const pbs_code = req.body.pbs_code;
    const zonal_code = req.body.zonal_code;
    const cc_code = req.body.cc_code;

    const numberOfConsumer = req.body.numberOfConsumer;
    const numberOfDcConsumer = req.body.numberOfDcConsumer;
    const kw = req.body.kw;
    const assign_to = req.body.assign_to;
    const update_by = req.body.update_by;
    const id = req.body.id;
    const data = [pbs_code, zonal_code, cc_code, numberOfConsumer, numberOfDcConsumer, kw, assign_to, update_by, id];
    console.log(data);
    const sqlInsert =
        `UPDATE book_information SET pbs_code=?,zonal_code=?,cc_code=?,numberOfConsumer=?,numberOfDcConsumer=?,kw=?,assign_to=?,update_by=? WHERE id=?`;
    db.query(sqlInsert, data, (err, result) => {
        res.send({ result });
        console.log(result.affectedRows + " record(s) updated");
        // res.send({ err });
    });

})
// cash Collection 
app.post('/cashAdd', async (req, res) => {
    const bookNo = req.body.bookNo;
    const pbs_code = req.body.pbs_code;
    const zonal_code = req.body.zonal_code;
    const cc_code = req.body.cc_code;
    const NumOfCashCollection = req.body.NumOfCashCollection;
    const AmountOfCashCollection = req.body.AmountOfCashCollection;
    const NumOfOtherCollection = req.body.NumOfOtherCollection;
    const AmmountOfOtherCollection = req.body.AmmountOfOtherCollection;
    const NumOfDC = req.body.NumOfDC;
    const AmmountOfDC = req.body.AmmountOfDC;
    const assign_to = req.body.assign_to;
    const collected_by = req.body.collected_by;
    const cdate = req.body.cdate;
    const entered_by = req.body.entered_by;

    const sqlInsert =
        "INSERT INTO dnp_collection (bookNo,pbs_code,zonal_code,cc_code,NumOfCashCollection,AmountOfCashCollection,NumOfOtherCollection,AmmountOfOtherCollection,NumOfDC,AmmountOfDC,assign_to,collected_by,cdate,today,entered_by) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?, CURRENT_TIMESTAMP,?)";
    db.query(sqlInsert, [bookNo, pbs_code, zonal_code, cc_code, NumOfCashCollection, AmountOfCashCollection, NumOfOtherCollection, AmmountOfOtherCollection, NumOfDC, AmmountOfDC, assign_to, collected_by, cdate, entered_by], (err, result) => {
        res.send(result);
    });
});
// KW Entry 
app.post('/kwAdd', async (req, res) => {
    const bookNo = req.body.bookNo;
    const pbs_code = req.body.pbs_code;
    const zonal_code = req.body.zonal_code;
    const cc_code = req.body.cc_code;
    const year = req.body.year;
    const month = req.body.month;
    const kw = req.body.kw;
    const kwAmount = req.body.kwAmount;
    const assign_to = req.body.assign_to;
    const entered_by = req.body.entered_by;
    const id = zonal_code + year + month + bookNo;
    const sqlInsert =
        "INSERT INTO kwh_sales (kw_id,bookNo,pbs_code,zonal_code,cc_code,year,month,kw,kwAmount,assign_to,today,entered_by) VALUES(?,?,?,?,?,?,?,?,?,?, CURRENT_TIMESTAMP,?)";
    // console.log(sqlInsert)
    db.query(sqlInsert, [id, bookNo, pbs_code, zonal_code, cc_code, year, month, kw, kwAmount, assign_to, entered_by], (err, result) => {
        res.send(result);
    });
});
// get Bills  
app.get('/bills', async (req, res) => {
    const sqlSelect =
        "SELECT * FROM bill";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
});
// get single Book  by bookno
app.get('/bill/:smsAccountNumber', async (req, res) => {
    const smsAccountNumber = req.params.smsAccountNumber;
    const sqlSelect =
        "SELECT * FROM bill INNER JOIN consumer on bill.smsAccountNumber=consumer.smsAccountNumber WHERE bill.smsAccountNumber=?";
    db.query(sqlSelect, [smsAccountNumber], (err, result) => {
        res.send(result);
    });
})
// get DNP List  
app.get('/dnpList', async (req, res) => {
    const zonal_code = req.query.zonal_code;
    const bookNo = req.query.bookNo;
    const sqlSelect =
        "SELECT * FROM consumer INNER JOIN arrear ON consumer.custId=arrear.custId WHERE consumer.`bookNo`=? and consumer.zonal_code=? order by consumer.accountNo;";
    db.query(sqlSelect, [bookNo, zonal_code], (err, result) => {
        res.send(result);
    });
});
// get Collection  
app.get('/collections', async (req, res) => {
    // const bookNo = req.params.bookNo;
    const sqlSelect =
        "SELECT dnp_collection.id,dnp_collection.bookNo,dnp_collection.NumOfCashCollection,dnp_collection.AmountOfCashCollection,dnp_collection.NumOfOtherCollection,dnp_collection.AmmountOfOtherCollection,dnp_collection.NumOfDC,dnp_collection.AmmountOfDC,dnp_collection.cdate,users.displayName FROM dnp_collection INNER JOIN users ON users.id = dnp_collection.collected_by WHERE MONTH(cdate) = MONTH(CURRENT_TIMESTAMP) AND YEAR(cdate) = YEAR(CURRENT_TIMESTAMP)";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
    // const query = {};
    // const cursor = cashCollection.find(query);
    // const users = await cursor.toArray();
    // res.send(users);
});
// get Collection  By Date
app.get('/Collection', async (req, res) => {
    const pbs_code = req.query.pbs_code;
    const zonal_code = req.query.zonal_code;
    const cc_code = req.query.cc_code;
    const bookNo = req.query.bookNo;
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;
    const assign_to = req.query.assign_to;
    const collected_by = req.query.collected_by;
    console.log(zonal_code, zonal_code, cc_code, bookNo, dateFrom, dateTo, assign_to, collected_by);
    let sqlSelect = '';
    if (cc_code && dateFrom && dateTo) {
        sqlSelect =
            "SELECT dnp_collection.id,dnp_collection.bookNo,dnp_collection.NumOfCashCollection,dnp_collection.AmountOfCashCollection,dnp_collection.NumOfOtherCollection,dnp_collection.AmmountOfOtherCollection,dnp_collection.NumOfDC,dnp_collection.AmmountOfDC,dnp_collection.cdate,users.displayName FROM dnp_collection INNER JOIN users ON users.id = dnp_collection.collected_by WHERE dnp_collection.cc_code=? AND cdate BETWEEN(?) AND (?)";
        db.query(sqlSelect, [cc_code, dateFrom, dateTo], (err, result) => {
            res.send(result);
        });
    }
    else if (zonal_code && bookNo && assign_to && collected_by && dateFrom && dateTo) {
        sqlSelect =
            "SELECT dnp_collection.id,dnp_collection.bookNo,dnp_collection.NumOfCashCollection,dnp_collection.AmountOfCashCollection,dnp_collection.NumOfOtherCollection,dnp_collection.AmmountOfOtherCollection,dnp_collection.NumOfDC,dnp_collection.AmmountOfDC,dnp_collection.cdate,users.displayName FROM dnp_collection INNER JOIN users ON users.id = dnp_collection.collected_by WHERE dnp_collection.zonal_code=? and dnp_collection.bookNo=? and dnp_collection.assign_to=? and dnp_collection.collected_by=? AND  cdate BETWEEN(?) AND (?)";
        db.query(sqlSelect, [zonal_code, bookNo, assign_to, collected_by, dateFrom, dateTo], (err, result) => {
            res.send(result);
        });
    }
    else if (zonal_code && dateFrom && dateTo) {
        sqlSelect =
            "SELECT dnp_collection.id,dnp_collection.bookNo,dnp_collection.NumOfCashCollection,dnp_collection.AmountOfCashCollection,dnp_collection.NumOfOtherCollection,dnp_collection.AmmountOfOtherCollection,dnp_collection.NumOfDC,dnp_collection.AmmountOfDC,dnp_collection.cdate,users.displayName FROM dnp_collection INNER JOIN users ON users.id = dnp_collection.collected_by WHERE dnp_collection.zonal_code=? AND  cdate BETWEEN(?) AND (?)";
        db.query(sqlSelect, [zonal_code, dateFrom, dateTo], (err, result) => {
            res.send(result);
        });
    }
    else if (zonal_code && assign_to && dateFrom && dateTo) {
        sqlSelect =
            "SELECT dnp_collection.id,dnp_collection.bookNo,dnp_collection.NumOfCashCollection,dnp_collection.AmountOfCashCollection,dnp_collection.NumOfOtherCollection,dnp_collection.AmmountOfOtherCollection,dnp_collection.NumOfDC,dnp_collection.AmmountOfDC,dnp_collection.cdate,users.displayName FROM dnp_collection INNER JOIN users ON users.id = dnp_collection.collected_by WHERE dnp_collection.zonal_code=? and dnp_collection.assign_to=? AND  cdate BETWEEN(?) AND (?)";
        db.query(sqlSelect, [zonal_code, assign_to, dateFrom, dateTo], (err, result) => {
            res.send(result);
        });
    }
    else if (zonal_code && collected_by && dateFrom && dateTo) {
        sqlSelect =
            "SELECT dnp_collection.id,dnp_collection.bookNo,dnp_collection.NumOfCashCollection,dnp_collection.AmountOfCashCollection,dnp_collection.NumOfOtherCollection,dnp_collection.AmmountOfOtherCollection,dnp_collection.NumOfDC,dnp_collection.AmmountOfDC,dnp_collection.cdate,users.displayName FROM dnp_collection INNER JOIN users ON users.id = dnp_collection.collected_by WHERE dnp_collection.zonal_code=? and dnp_collection.collected_by=? AND  cdate BETWEEN(?) AND (?)";
        db.query(sqlSelect, [zonal_code, collected_by, dateFrom, dateTo], (err, result) => {
            res.send(result);
        });
    }
    else if (pbs_code && assign_to && dateFrom && dateTo) {
        sqlSelect =
            "SELECT dnp_collection.id,dnp_collection.bookNo,dnp_collection.NumOfCashCollection,dnp_collection.AmountOfCashCollection,dnp_collection.NumOfOtherCollection,dnp_collection.AmmountOfOtherCollection,dnp_collection.NumOfDC,dnp_collection.AmmountOfDC,dnp_collection.cdate,users.displayName FROM dnp_collection INNER JOIN users ON users.id = dnp_collection.collected_by WHERE dnp_collection.pbs_code=? and dnp_collection.assign_to=? AND  cdate BETWEEN(?) AND (?)";
        db.query(sqlSelect, [pbs_code, assign_to, dateFrom, dateTo], (err, result) => {
            res.send(result);
        });
    }
    else if (pbs_code && collected_by && dateFrom && dateTo) {
        sqlSelect =
            "SELECT dnp_collection.id,dnp_collection.bookNo,dnp_collection.NumOfCashCollection,dnp_collection.AmountOfCashCollection,dnp_collection.NumOfOtherCollection,dnp_collection.AmmountOfOtherCollection,dnp_collection.NumOfDC,dnp_collection.AmmountOfDC,dnp_collection.cdate,users.displayName FROM dnp_collection INNER JOIN users ON users.id = dnp_collection.collected_by WHERE dnp_collection.pbs_code=? and dnp_collection.collected_by=? AND  cdate BETWEEN(?) AND (?)";
        db.query(sqlSelect, [pbs_code, collected_by, dateFrom, dateTo], (err, result) => {
            res.send(result);
        });
    }

    else if (pbs_code && dateFrom && dateTo) {
        sqlSelect =
            "SELECT dnp_collection.id,dnp_collection.bookNo,dnp_collection.NumOfCashCollection,dnp_collection.AmountOfCashCollection,dnp_collection.NumOfOtherCollection,dnp_collection.AmmountOfOtherCollection,dnp_collection.NumOfDC,dnp_collection.AmmountOfDC,dnp_collection.cdate,users.displayName FROM dnp_collection INNER JOIN users ON users.id = dnp_collection.collected_by WHERE dnp_collection.pbs_code=? AND  cdate BETWEEN(?) AND (?)";
        db.query(sqlSelect, [pbs_code, dateFrom, dateTo], (err, result) => {
            res.send(result);
        });
    }


});
// get Collection  
app.get('/kws', async (req, res) => {
    // const bookNo = req.params.bookNo;
    const sqlSelect =
        "SELECT * from kwh_sales WHERE month = MONTH(CURRENT_TIMESTAMP) AND year = YEAR(CURRENT_TIMESTAMP) order by today";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
    // const query = {};
    // const cursor = cashCollection.find(query);
    // const users = await cursor.toArray();
    // res.send(users);
});
//get kwh by office & month
app.get('/kw', async (req, res) => {
    const pbs_code = req.query.pbs_code;
    const zonal_code = req.query.zonal_code;
    const year = req.query.year;
    const month = req.query.month;

    console.log(pbs_code, zonal_code, year, month);
    let sqlSelect = '';
    if (pbs_code && zonal_code && year && month) {
        sqlSelect =
            "SELECT * from kwh_sales WHERE pbs_code=? and zonal_code=? and year=? and month=? order by kw_id";
        db.query(sqlSelect, [pbs_code, zonal_code, year, month], (err, result) => {
            res.send(result);
        });
    }
    else if (pbs_code && zonal_code && year) {
        sqlSelect =
            "SELECT * from kwh_sales WHERE pbs_code=? and zonal_code=? and year=? order by kw_id";
        db.query(sqlSelect, [pbs_code, zonal_code, year], (err, result) => {
            res.send(result);
        });
    }
    else if (pbs_code && year && month) {
        sqlSelect =
            "SELECT * from kwh_sales WHERE pbs_code=? and year=? and month=? order by kw_id";
        db.query(sqlSelect, [pbs_code, year, month], (err, result) => {
            res.send(result);
        });
    }
    else if (pbs_code && year) {
        sqlSelect =
            "SELECT * from kwh_sales WHERE pbs_code=? and year=? order by kw_id";
        db.query(sqlSelect, [pbs_code, year], (err, result) => {
            res.send(result);
        });
    }
});
app.listen(port, () => {
    console.log(`Office Info app listening on port ${port}`)
})