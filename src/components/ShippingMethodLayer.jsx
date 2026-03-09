import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Select from "react-select";
import { selectStyles } from "../helper/SelectStyles";
import ShippingMethodApi from "../Api/ShippingMethodApi";
import usePermissions from "../hook/usePermissions";
import ShowNotifications from "../helper/ShowNotifications";

const ShippingMethodLayer = () => {
    const { hasPermission } = usePermissions();
    const [type, setType] = useState(""); // weight, pincode, amount
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const typeOptions = [
        { value: "weight", label: "Total Product Weight Based" },
        { value: "pincode", label: "Address Pincode Based" },
        { value: "amount", label: "Order Amount Based" },
    ];

    useEffect(() => {
        fetchActiveMethod();
    }, []);

    const fetchActiveMethod = async () => {
        setFetching(true);
        const result = await ShippingMethodApi.getActive();
        if (result.status && result.response.data) {
            const data = result.response.data;
            setType(data.type);
            setRules(data.rules || []);
        }
        setFetching(false);
    };

    const handleTypeChange = (selectedOption) => {
        setType(selectedOption.value);
        // Reset rules when type changes, or if we have them saved in an object for each type we could restore
        // For simplicity, let's just clear or keep if user wants to switch back
        setRules([]);
    };

    const addRule = () => {
        if (type === "weight") {
            setRules([...rules, { weight: "", amount: "" }]);
        } else if (type === "pincode") {
            setRules([...rules, { pincode: "", amount: "" }]);
        } else if (type === "amount") {
            setRules([...rules, { from: "", to: "", amount: "" }]);
        }
    };

    const removeRule = (index) => {
        const updatedRules = rules.filter((_, i) => i !== index);
        setRules(updatedRules);
    };

    const handleRuleChange = (index, field, value) => {
        const updatedRules = [...rules];
        updatedRules[index][field] = value;
        setRules(updatedRules);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!type) {
            ShowNotifications.showAlertNotification("Please select a shipping method type", false);
            return;
        }
        if (rules.length === 0) {
            ShowNotifications.showAlertNotification("Please add at least one rule", false);
            return;
        }

        setLoading(true);

        const processedRules = rules.map(rule => {
            const newRule = { ...rule };
            if (newRule.weight !== undefined) newRule.weight = Number(newRule.weight);
            if (newRule.amount !== undefined) newRule.amount = Number(newRule.amount);
            if (newRule.from !== undefined) newRule.from = Number(newRule.from);
            if (newRule.to !== undefined) newRule.to = Number(newRule.to);
            if (newRule.pincode !== undefined) {
                // Keep pincode as string if it can have leading zeros or contains letters (if applicable), 
                // but the user's sample only mentioned from, to, and amount for the amount based type.
                // Generally, pincodes are stored as strings to preserve leading zeros.
            }
            return newRule;
        });

        const payload = {
            type,
            rules: processedRules,
            isActive: true
        };

        await ShippingMethodApi.save(payload);
        setLoading(false);
    };

    if (fetching) {
        return (
            <div className="d-flex justify-content-center align-items-center h-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24">
                <h6 className="text-primary-600 pb-2 mb-0">Shipping Methods Configuration</h6>
            </div>
            <div className="card-body p-24">
                <form onSubmit={handleSubmit}>
                    <div className="row gy-4">
                        <div className="col-md-12">
                            <label className="form-label fw-semibold">Choose Shipping Calculation Type</label>
                            <Select
                                options={typeOptions}
                                value={typeOptions.find(opt => opt.value === type)}
                                onChange={handleTypeChange}
                                styles={selectStyles()}
                                placeholder="Select Shipping Type"
                                isClearable={false}
                            />
                        </div>

                        {type && (
                            <div className="col-md-12">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="mb-0 text-md fw-bold">Rules for {typeOptions.find(opt => opt.value === type)?.label}</h6>
                                    {hasPermission("Shipping Methods", "add") && (
                                        <button
                                            type="button"
                                            className="btn btn-primary-600 radius-8 px-20 py-8 d-flex align-items-center gap-2"
                                            onClick={addRule}
                                            style={{ backgroundColor: "#003366", borderColor: "#003366" }}
                                        >
                                            <Icon icon="lucide:plus" width="18" height="18" />
                                            Add {type === "pincode" ? "Pincode" : type === "weight" ? "Weight" : "Amount Range"}
                                        </button>
                                    )}
                                </div>

                                <div className="table-responsive">
                                    <table className="table border-top">
                                        <thead>
                                            <tr>
                                                {type === "weight" && (
                                                    <>
                                                        <th className="bg-light-600">Max Weight (kg)</th>
                                                        <th className="bg-light-600">Shipping Charge</th>
                                                    </>
                                                )}
                                                {type === "pincode" && (
                                                    <>
                                                        <th className="bg-light-600">Pincode</th>
                                                        <th className="bg-light-600">Shipping Charge</th>
                                                    </>
                                                )}
                                                {type === "amount" && (
                                                    <>
                                                        <th className="bg-light-600">From Amount</th>
                                                        <th className="bg-light-600">To Amount</th>
                                                        <th className="bg-light-600">Shipping Charge</th>
                                                    </>
                                                )}
                                                <th className="bg-light-600 text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rules.length === 0 ? (
                                                <tr>
                                                    <td colSpan={type === "amount" ? 4 : 3} className="text-center py-4">
                                                        No rules added yet. Click "Add" to get started.
                                                    </td>
                                                </tr>
                                            ) : (
                                                rules.map((rule, index) => (
                                                    <tr key={index}>
                                                        {type === "weight" && (
                                                            <>
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control radius-8"
                                                                        placeholder="e.g. 10"
                                                                        value={rule.weight}
                                                                        onChange={(e) => handleRuleChange(index, "weight", e.target.value)}
                                                                        required
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control radius-8"
                                                                        placeholder="e.g. 50"
                                                                        value={rule.amount}
                                                                        onChange={(e) => handleRuleChange(index, "amount", e.target.value)}
                                                                        required
                                                                    />
                                                                </td>
                                                            </>
                                                        )}
                                                        {type === "pincode" && (
                                                            <>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control radius-8"
                                                                        placeholder="e.g. 600001"
                                                                        value={rule.pincode}
                                                                        onChange={(e) => handleRuleChange(index, "pincode", e.target.value)}
                                                                        required
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control radius-8"
                                                                        placeholder="e.g. 50"
                                                                        value={rule.amount}
                                                                        onChange={(e) => handleRuleChange(index, "amount", e.target.value)}
                                                                        required
                                                                    />
                                                                </td>
                                                            </>
                                                        )}
                                                        {type === "amount" && (
                                                            <>
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control radius-8"
                                                                        placeholder="0"
                                                                        value={rule.from}
                                                                        onChange={(e) => handleRuleChange(index, "from", e.target.value)}
                                                                        required
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control radius-8"
                                                                        placeholder="500"
                                                                        value={rule.to}
                                                                        onChange={(e) => handleRuleChange(index, "to", e.target.value)}
                                                                        required
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control radius-8"
                                                                        placeholder="e.g. 50"
                                                                        value={rule.amount}
                                                                        onChange={(e) => handleRuleChange(index, "amount", e.target.value)}
                                                                        required
                                                                    />
                                                                </td>
                                                            </>
                                                        )}
                                                        <td className="text-end">
                                                            <button
                                                                type="button"
                                                                className="btn btn-icon btn-danger-100 text-danger-600 rounded-circle"
                                                                onClick={() => removeRule(index)}
                                                            >
                                                                <Icon icon="mingcute:delete-2-line" width="20" height="20" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {type && hasPermission("Shipping Methods", "add") && (
                        <div className="d-flex justify-content-end gap-2 mt-24">
                            <button
                                type="submit"
                                className="btn btn-primary radius-8 px-32 py-12 justify-content-center d-flex align-items-center gap-2"
                                disabled={loading}
                                style={{ backgroundColor: "#003366", borderColor: "#003366" }}
                            >
                                {loading && (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                )}
                                {loading ? "Saving..." : "Save Settings"}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ShippingMethodLayer;
