import React, { useState } from "react";

export default function TestCards() {
    const [openSection, setOpenSection] = useState(null);

    const cardTests = [
        ["Visa", "4200 0000 0000 0000", "123", "12/34"],
        ["Amex", "3700 0000 0000 0000", "1234", "12/34"],
        ["MasterCard", "5400 0000 0000 0000", "123", "12/34"],
        ["UnionPay", "6200 0000 0000 0000", "123", "12/34"],
        ["Diners", "3800 0000 0000 0000", "123", "12/34"],
    ];

    const mobilePayments = {
        Telebirr: [
            ["0900123456", "12345"],
            ["0900112233", "12345"],
            ["0900881111", "12345"],
        ],
        Amole: [
            ["0900123456", "12345"],
            ["0900112233", "12345"],
            ["0900881111", "12345"],
        ],
        CBEBirr: [
            ["0900123456"],
            ["0900112233"],
            ["0900881111"],
        ],
        "COOPPay-ebirr": [
            ["0900123456"],
            ["0900112233"],
            ["0900881111"],
        ],
        "M-Pesa": [
            ["0700123456"],
            ["0700112233"],
            ["0700881111"],
        ],
    };

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 mt-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
                Chapa Test Accounts
            </h2>

            {/* CARD SECTION */}
            <div className="border rounded-xl overflow-hidden">
                <button
                    onClick={() => toggleSection("cards")}
                    className="w-full px-4 py-3 bg-orange-50 flex justify-between items-center font-semibold text-orange-500"
                >
                    Card Test Accounts
                    <span>{openSection === "cards" ? "−" : "+"}</span>
                </button>

                {openSection === "cards" && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 text-left">Type</th>
                                    <th className="p-3 text-left">Card Number</th>
                                    <th className="p-3 text-left">CVV</th>
                                    <th className="p-3 text-left">Expiry</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cardTests.map((card, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="p-3">{card[0]}</td>
                                        <td className="p-3 font-mono">{card[1]}</td>
                                        <td className="p-3">{card[2]}</td>
                                        <td className="p-3">{card[3]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MOBILE PAYMENT SECTIONS */}
            {Object.entries(mobilePayments).map(([provider, accounts]) => (
                <div key={provider} className="border rounded-xl overflow-hidden">
                    <button
                        onClick={() => toggleSection(provider)}
                        className="w-full px-4 py-3 bg-orange-50 flex justify-between items-center font-semibold text-orange-500"
                    >
                        {provider}
                        <span>{openSection === provider ? "−" : "+"}</span>
                    </button>

                    {openSection === provider && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-3 text-left">Phone</th>
                                        {accounts[0].length > 1 && (
                                            <th className="p-3 text-left">OTP</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {accounts.map((acc, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="p-3 font-mono">{acc[0]}</td>
                                            {acc[1] && <td className="p-3">{acc[1]}</td>}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ))}

            <p className="text-xs text-gray-400 pt-2">
                Last updated on August 29, 2024
            </p>
        </div>
    );
}