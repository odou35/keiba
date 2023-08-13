import express, { application } from "express";
import mysql from "mysql";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const app = express();

app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@habanero35",
    database: "keiba",
});

con.connect(function (err) {
    if (err) {
        console.log("Error in Connection");
    } else {
        console.log("Connected");
    }
});

//ログイン
app.post("/login", (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err)
            return res.json({
                Status: "Error",
                Error: "Error in running query",
            });
        if (result.length > 0) {
            const userID = result[0].UserID; // ユーザーIDを取得
            // ユーザーIDを含むJWTを生成
            const token = jwt.sign({ userID: userID }, "jwt-secret-key", {
                expiresIn: "1d",
            });
            res.cookie("token", token, { httpOnly: true });
            // クライアントにJWTを返す
            return res.json({ Status: "Success", token: token });
        } else {
            return res.json({
                Status: "Error",
                Error: "Wrong Email or Password",
            });
        }
    });
});
//サインイン
app.post("/signup", (req, res) => {
    const sql = "INSERT INTO users (name,email,password) VALUES (?)";
    const values = [req.body.name, req.body.email, req.body.password];
    console.log(values);
    con.query(sql, [values], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    });
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are no Authenticated" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) return res.json({ Error: "Token wrong" });
            req.userID = decoded.userID;
            next();
        });
    }
};

// クライアントから送信されたJWTトークンを検証してユーザーIDを返すエンドポイント
app.get("/cookie", verifyUser, (req, res) => {
    return res.json({ userID: req.userID });
});

//クライアントからuserIDを取得して該当するレコードを返す
app.get("/records/:id", (req, res) => {
    const id = req.params.id;
    const sql = `
    SELECT r.BettingID, r.UserID, r.RaceDate, l.RaceLocationName, c.RaceConditionName, b.BetTypeName, r.InvestmentAmount, r.PayoutAmount, r.ExpenseAmount
    FROM BettingRecord r
    JOIN RaceLocation l ON r.RaceLocationID = l.RaceLocationID
    JOIN RaceCondition c ON r.RaceConditionID = c.RaceConditionID
    JOIN BetType b ON r.BetTypeID = b.BetTypeID
    WHERE UserID = ?`;
    // queryの第二引数はプレースホルダーに該当
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "Get records in sql" });
        return res.json({ Result: result });
    });
});

//クライアントからuserIdを取得してレコードを作成
app.post("/records/", (req, res) => {
    const sql =
        "INSERT INTO BettingRecord (UserID,RaceDate,RaceLocationID,RaceConditionID,BetTypeID,InvestmentAmount,PayoutAmount,ExpenseAmount) VALUES (?)";
    const {
        UserID,
        RaceDate,
        RaceLocationID,
        RaceConditionID,
        BetTypeID,
        InvestmentAmount,
        PayoutAmount,
    } = req.body;
    // 収支を計算
    const ExpenseAmount = PayoutAmount - InvestmentAmount;
    const values = [
        UserID,
        RaceDate,
        RaceLocationID,
        RaceConditionID,
        BetTypeID,
        InvestmentAmount,
        PayoutAmount,
        ExpenseAmount,
    ];

    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Error: "Inside add query" });
        return res.json({ Status: "Success" });
    });
});

// レコード削除
app.post("/delete", (req,res)=>{
    const sql = "DELETE FROM BettingRecord WHERE BettingID IN (?)";
    console.log(req.body);
    const values = Object.keys(req.body).filter((BettingID) => req.body[BettingID]);
    console.log(values);
    con.query(sql, [values], (err,result)=>{
        if (err) return res.json({Error: "Inside delete query"});
        return res.json({Status: "Success"});
    })
})

// 競馬場情報取得
app.get("/api/location", (req, res) => {
    const sql = "SELECT * FROM RaceLocation";
    con.query(sql, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        res.json(data);
    });
});
// 馬券情報取得
app.get("/api/betType", (req, res) => {
    const sql = "SELECT * FROM BetType";
    con.query(sql, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        res.json(data);
    });
});

// クラス情報取得
app.get("/api/condition", (req, res) => {
    const sql = "SELECT * FROM RaceCondition";
    con.query(sql, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        res.json(data);
    });
});


app.listen(8081, () => {
    console.log("Running");
});
