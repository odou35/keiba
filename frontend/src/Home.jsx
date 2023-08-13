import React, { useState, useEffect } from "react";
import axios from "axios";
import AddRecord from "./AddRecord";
import "./Home.css";
import Checkbox from "./Checkbox";

function Home() {
    const [userID, setUserID] = useState(null);
    const [recordData, setRecordData] = useState([]);
    const [isChecked, setIsChecked] = useState([]);
    axios.defaults.withCredentials = true;

    useEffect(() => {
        getJwt();
    }, []);

    const getJwt = async () => {
        const { data } = await axios.get("http://localhost:8081/cookie");
        setUserID(data.userID); // ユーザーIDをstateに設定
        fetchData(data.userID); // ユーザーIDを使ってデータを取得
    };

    const fetchData = (userID) => {
        axios
            .get("http://localhost:8081/records/" + userID)
            .then((res) => {
                console.log(res.data.Result);
                setRecordData(res.data.Result);
            })
            .catch((err) => console.log(err));
    };
    const handleAddRecord = (newRecord) => {
        axios
            .post("http://localhost:8081/records/", newRecord)
            .then((res) => {
                console.log(res.data); // レスポンスのデータをログに出力
                fetchData(userID); // データを取得するなどの後続処理
            })
            .catch((err) => console.log(err));
    };
    
    const handleCheckboxChange = (bettingID) => {
        setIsChecked((prev) => ({
            ...prev,
            [bettingID]: !prev[bettingID],
        }));
    };

    const handleDelete = () => {
        console.log(isChecked);
        axios
            .post("http://localhost:8081/delete", isChecked)
            .then((res)=>{
                console.log(res.data);
                fetchData(userID)
            })
            .catch((err)=>console.log(err))
    };

    return (
        <div>
            {Object.values(isChecked).some(Boolean) && (
                <button onClick={handleDelete}>削除</button>
            )}
            <table>
                <thead>
                    <tr>
                        <th>
                            <Checkbox
                                checked={Object.values(isChecked).every(
                                    Boolean
                                )}
                                onChange={() => {
                                    setIsChecked(() =>
                                        recordData.reduce((acc, record) => {
                                            acc[record.BettingID] =
                                                !Object.values(isChecked).every(
                                                    Boolean
                                                );
                                            return acc;
                                        }, {})
                                    );
                                }}
                            />
                        </th>
                        <th>日時</th>
                        <th>競馬場</th>
                        <th>クラス</th>
                        <th>馬券</th>
                        <th>投資額</th>
                        <th>払戻額</th>
                        <th>収支</th>
                    </tr>
                </thead>
                <tbody>
                    {recordData.map((record) => (
                        <tr key={record.BettingID}>
                            <td>
                                <Checkbox
                                    checked={
                                        isChecked[record.BettingID] || false
                                    }
                                    onChange={() =>
                                        handleCheckboxChange(record.BettingID)
                                    }
                                />
                            </td>
                            <td>{record.RaceDate.split("T")[0]}</td>
                            <td>{record.RaceLocationName}</td>
                            <td>{record.RaceConditionName}</td>
                            <td>{record.BetTypeName}</td>
                            <td>{record.InvestmentAmount}</td>
                            <td>{record.PayoutAmount}</td>
                            <td>{record.ExpenseAmount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <AddRecord onAdd={handleAddRecord} userID={userID} />
        </div>
    );
}

export default Home;
