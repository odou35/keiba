import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import "./AddRecord.css";
registerLocale("ja", ja);

function AddRecord({ onAdd, userID }) {
    const [raceDate, setRaceDate] = useState("");
    const [raceLocationID, setRaceLocationID] = useState("");
    const [raceConditionID, setRaceConditionID] = useState("");
    const [betTypeID, setBetTypeID] = useState("");
    const [investment, setInvestment] = useState(0);
    const [payout, setPayout] = useState(0);
    
    const [raceLocationOptions, setRaceLocationOptions] = useState([]);
    const [raceConditionOptions, setRaceConditionOptions] = useState([]);
    const [raceBetTypeOptions, setBetTypeOptions] = useState([]);
    axios.defaults.withCredentials = true;
    const fetchLocation = () => {
        axios
            .get("http://localhost:8081/api/location")
            .then((response) => {
                setRaceLocationOptions(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error("競馬場の情報の取得に失敗しました: ", error);
            });
    };
    const fetchBetType = () => {
        axios
            .get("http://localhost:8081/api/betType")
            .then((response) => {
                setBetTypeOptions(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error("馬券の情報の取得に失敗しました: ", error);
            });
    };
    const fetchCondition = () => {
        axios
            .get("http://localhost:8081/api/condition")
            .then((response) => {
                setRaceConditionOptions(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error("クラスの情報の取得に失敗しました: ", error);
            });
    };
    useEffect(() => {
        // 競馬場の情報を取得するAPIリクエストを行う
        fetchBetType();
        fetchLocation();
        fetchCondition();
    }, []);
    const handleSubmit = (event) => {
        event.preventDefault();
        if (
            !raceDate ||
            !raceLocationID ||
            !raceConditionID ||
            !betTypeID ||
            !investment
        ) {
            alert("全てのフィールドを入力してください");
            return;
        }
        const newRecord = {
            UserID: userID,
            RaceDate: raceDate.toISOString().split("T")[0],
            RaceLocationID: raceLocationID,
            RaceConditionID: raceConditionID,
            BetTypeID: betTypeID,
            InvestmentAmount: investment,
            PayoutAmount: payout,
        };
        onAdd(newRecord);
        setRaceDate(null);
        setRaceLocationID("");
        setRaceConditionID("");
        setBetTypeID("");
        setInvestment("");
        setPayout("");
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <label>
                日付：
                <DatePicker
                    locale={ja}
                    selected={raceDate}
                    onChange={(date) => setRaceDate(date)} // カレンダーで選択された日付をstateに設定
                    dateFormat="yyyy/MM/dd" // カレンダーで表示する日付のフォーマット
                    required
                />
            </label>
            <br />
            <label>
                競馬場：
                <select
                    value={Number(raceLocationID)}
                    onChange={(e) => setRaceLocationID(Number(e.target.value))}
                    required
                >
                    <option value="">-- 競馬場を選択してください --</option>
                    {raceLocationOptions.map((location) => (
                        <option
                            key={location.RaceLocationID}
                            value={location.RaceLocationID}
                        >
                            {location.RaceLocationName}
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <label>
                クラス：
                <select
                    value={Number(raceConditionID)}
                    onChange={(e) => setRaceConditionID(Number(e.target.value))}
                    required
                >
                    <option value="">-- クラスを選択してください --</option>
                    {raceConditionOptions.map((condition) => (
                        <option
                            key={condition.RaceConditionID}
                            value={condition.RaceConditionID}
                        >
                            {condition.RaceConditionName}
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <label>
                馬券：
                <select
                    value={Number(betTypeID)}
                    onChange={(e) => setBetTypeID(Number(e.target.value))}
                    required
                >
                    <option value="">-- 馬券を選択してください --</option>
                    {raceBetTypeOptions.map((betType) => (
                        <option
                            key={betType.BetTypeID}
                            value={betType.BetTypeID}
                        >
                            {betType.BetTypeName}
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <label>
                投資額：
                <input
                    type="number"
                    value={investment === 0 ? "" : investment.toString()}
                    onChange={(e) => setInvestment(Number(e.target.value))}
                    required
                />
            </label>
            <br />
            <label>
                払戻額：
                <input
                    type="number"
                    value={payout}
                    onChange={(e) => setPayout(Number(e.target.value))}
                    list="payout-suggestions"
                    required
                />
            </label>
            <br />

            <label>
                収支：
                <input type="number" value={payout - investment} readOnly />
            </label>
            <br />
            <button type="submit">保存</button>
        </form>
    );
}

export default AddRecord;
