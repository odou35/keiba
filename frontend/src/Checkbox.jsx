import React from "react";

function Checkbox({ checked, onChange }) {
    return <input type="checkbox" checked={checked} onChange={onChange} />;
}

export default Checkbox;
