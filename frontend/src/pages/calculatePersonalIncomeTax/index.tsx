import {
    BankOutlined,
    InfoCircleTwoTone,
    UserOutlined,
} from "@ant-design/icons"
import { Button, InputNumber, Modal, Radio, Space, Table } from "antd"
import React, { useState } from "react"
import ModalExplain from "./components/ModalExplain"
import TableResults from "./components/TableResults"

interface IOptionRegulation {
    key: number
    name: string
    contents: {
        key: string
        content: string
    }[]
}

interface ITaxBracket {
    level: number;
    from: number;
    to: number | null;
    rate: number;
    taxAmount: number;
}

const CalculatePersonalIncomeTaxPage = () => {
    const optionRegulations: IOptionRegulation[] = [
        {
            key: 1,
            name: "Từ 01/07/2023 - 30/06/2024",
            contents: [
                {
                    key: "c1",
                    content:
                        "Áp dụng mức lương cơ sở có hiệu lực từ ngày 01/07/2023 (Theo Nghị định 24/2023/NĐ-CP) đến ngày 30/06/2024",
                },
                {
                    key: "c2",
                    content:
                        "Áp dụng mức lương tối thiểu vùng có hiệu lực từ ngày 01/07/2022 (Theo điều 3, Nghị định 38/2022/NĐ-CP) đến ngày 30/06/2024",
                },
                {
                    key: "c3",
                    content:
                        "Áp dụng mức giảm trừ gia cảnh mới nhất 11 triệu đồng/tháng (132 triệu đồng/năm) với người nộp thuế và 4,4 triệu đồng/tháng với mỗi người phụ thuộc (Theo Nghị Quyết số 954/2020/UBTVQH14)",
                },
            ],
        },
        {
            key: 2,
            name: "Từ 01/07/2024 (Mới nhất)",
            contents: [
                {
                    key: "c1",
                    content:
                        "Áp dụng mức lương cơ sở mới nhất có hiệu lực từ ngày 01/07/2024 (Theo Nghị định số 73/2024/NĐ-CP)",
                },
                {
                    key: "c2",
                    content:
                        "Áp dụng mức lương tối thiểu vùng mới nhất có hiệu lực từ ngày 01/07/2024 (Theo Nghị định 74/2024/NĐ-CP)",
                },
                {
                    key: "c3",
                    content:
                        "Áp dụng mức giảm trừ gia cảnh mới nhất 11 triệu đồng/tháng (132 triệu đồng/năm) với người nộp thuế và 4,4 triệu đồng/tháng với mỗi người phụ thuộc (Theo Nghị Quyết số 954/2020/UBTVQH14)",
                },
            ],
        },
    ]
    const [regulationSelected, setRegulationSelected] = useState<number>(1)
    const [valueInputNumberIncome, setValueInputNumberIncome] =
        useState<number>(0)
    const [valueRadioInsurance, setValueRadioInsurance] = useState<number>(1)
    const [valueInputNumberInsurance, setValueInputNumberInsurance] =
        useState<number>(0)
    const [valueLocation, setValueLocation] = useState(1)
    const [isOpenModalExplain, setIsOpenModalExplain] = useState(false)
    const [valueInputNumberPersonal, setValueInputNumberPersonal] =
        useState<number>(0)
    const [isOpenResult, setIsOpenResult] = useState(false)

    // Thêm các hằng số cho mức lương tối đa đóng bảo hiểm
    const MAX_SALARY_SOCIAL_INSURANCE = 46800000; // 20 * lương cơ sở (2.34tr)
    const MAX_SALARY_HEALTH_INSURANCE = 46800000; // 20 * lương cơ sở (2.34tr) 
    const MAX_SALARY_UNEMPLOYMENT = 99200000; // Mức trần đóng BHTN vùng 1 là 99.2tr

    // Tính toán các khoản bảo hiểm với giới hạn trần
    const socialInsurance = Math.min(valueInputNumberIncome, MAX_SALARY_SOCIAL_INSURANCE) * 0.08;
    const healthInsurance = Math.min(valueInputNumberIncome, MAX_SALARY_HEALTH_INSURANCE) * 0.015;
    const unemploymentInsurance = Math.min(valueInputNumberIncome, MAX_SALARY_UNEMPLOYMENT) * 0.01;

    const personalDeduction = 11000000; // Giảm trừ gia cảnh bản thân
    const dependentDeduction = valueInputNumberPersonal * 4400000; // Giảm trừ người phụ thuộc

    // Thu nhập trước thuế
    const incomeBeforeTax = valueInputNumberIncome - (socialInsurance + healthInsurance + unemploymentInsurance);

    // Thu nhập chịu thuế
    const taxableIncome = Math.max(0, incomeBeforeTax - (personalDeduction + dependentDeduction));

    // Chi tiết thuế theo từng mức
    const calculateDetailedTax = (income: number): ITaxBracket[] => {
        const brackets: ITaxBracket[] = [
            { level: 1, from: 0, to: 5000000, rate: 0.05, taxAmount: 0 },
            { level: 2, from: 5000000, to: 10000000, rate: 0.10, taxAmount: 0 },
            { level: 3, from: 10000000, to: 18000000, rate: 0.15, taxAmount: 0 },
            { level: 4, from: 18000000, to: 32000000, rate: 0.20, taxAmount: 0 },
            { level: 5, from: 32000000, to: 52000000, rate: 0.25, taxAmount: 0 },
            { level: 6, from: 52000000, to: 80000000, rate: 0.30, taxAmount: 0 },
            { level: 7, from: 80000000, to: null, rate: 0.35, taxAmount: 0 },
        ];

        let remainingIncome = income;
        
        return brackets.map(bracket => {
            if (remainingIncome <= 0) return { ...bracket, taxAmount: 0 };
            
            const taxableAmount = bracket.to 
                ? Math.min(remainingIncome, bracket.to - bracket.from)
                : remainingIncome;
            
            const taxAmount = taxableAmount > 0 ? taxableAmount * bracket.rate : 0;
            remainingIncome -= taxableAmount;
            
            return {
                ...bracket,
                taxAmount: taxAmount
            };
        });
    };

    // Tổng thuế phải nộp
    const personalIncomeTax = calculateDetailedTax(taxableIncome).reduce((sum, bracket) => sum + bracket.taxAmount, 0);

    return (
        <div
            className={` mt-5 px-4 mx-auto max-w-[1230px] h-full bg-white p-5  rounded-lg flex flex-col gap-4`}
        >
            <p className="text-[20px] font-bold text-[#222831]">
                Công cụ tính Thuế thu nhập cá nhân chuẩn 2024
            </p>
            <div className="flex items-center gap-1">
                <p className="text-[18px] font-bold">Áp dụng quy định</p>
                {optionRegulations.map((item) => {
                    return (
                        <div
                            key={item.key}
                            className={`rounded-full border border-solid  p-2 m-2 w-[250px] flex gap-3 ${
                                regulationSelected === item.key
                                    ? "text-blue border-blue"
                                    : "text-gray border-gray"
                            }`}
                            onClick={() => {
                                setRegulationSelected(item.key)
                            }}
                        >
                            <input
                                type="radio"
                                name="regulation"
                                value={item.key}
                                onChange={() => {
                                    setRegulationSelected(item.key)
                                }}
                                className="ml-1 scale-150"
                                checked={regulationSelected === item.key}
                            />
                            <label>{item.name}</label>
                        </div>
                    )
                })}
            </div>
            <div>
                {optionRegulations
                    .filter((item) => item.key === regulationSelected)
                    .map((item) => {
                        return (
                            <ul key={item.key} className="flex flex-col gap-3">
                                {item.contents.map((content) => {
                                    return (
                                        <li
                                            key={content.key}
                                            className="flex gap-2 !text-[16px]"
                                        >
                                            <InfoCircleTwoTone />
                                            {content.content}
                                        </li>
                                    )
                                })}
                            </ul>
                        )
                    })}
            </div>
            <div className="flex gap-10 text-[20px]">
                <div className="">
                    <p>Giảm trừ gia cảnh bản thân</p>
                    <p className="font-bold">11,000,000đ</p>
                </div>
                <div>
                    <p>Người phụ thuộc</p>
                    <p className="font-bold">4,400,000đ</p>
                </div>
            </div>
            <div className="text-[20px]">
                <p>Thu Nhập (Gross) </p>
                <InputNumber
                    prefix={<BankOutlined />}
                    value={valueInputNumberIncome}
                    formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    onChange={(value) => {
                        setValueInputNumberIncome(value ?? 0)
                    }}
                    className="min-w-[500px]"
                    size="large"
                    suffix="VND"
                />
            </div>
            <div className="text-[20px]">
                <p>Mức lương đóng bảo hiểm</p>
                <Radio.Group
                    onChange={(e) => {
                        setValueRadioInsurance(e.target.value)
                    }}
                    value={valueRadioInsurance}
                >
                    <Space direction="vertical">
                        <Radio value={1} className="text-[16px]">
                            Trên lương chính thức
                        </Radio>
                        <Radio value={2} className="text-[16px]">
                            <div className="flex items-center gap-3">
                                <div> Khác</div>
                                {valueRadioInsurance === 2 ? (
                                    <InputNumber
                                        prefix={<BankOutlined />}
                                        min={0}
                                        value={valueInputNumberIncome}
                                        formatter={(value) =>
                                            `${value}`.replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ","
                                            )
                                        }
                                        onChange={(value) => {
                                            setValueInputNumberIncome(
                                                value ?? 0
                                            )
                                        }}
                                        size="large"
                                        suffix="VND"
                                        className="min-w-[500px]"
                                    />
                                ) : null}
                            </div>
                        </Radio>
                    </Space>
                </Radio.Group>
            </div>
            <div className="flex items-center gap-2">
                <p className="flex items-center gap-2 text-[20px]">
                    Vùng:{" "}
                    <div
                        className="text-red cursor-pointer hover:underline "
                        onClick={() => {
                            setIsOpenModalExplain(true)
                        }}
                    >
                        (Giải thích)
                    </div>
                </p>
                {isOpenModalExplain && (
                    <ModalExplain
                        isOpenModalExplain={isOpenModalExplain}
                        setIsOpenModalExplain={setIsOpenModalExplain}
                    />
                )}
                <Radio.Group
                    onChange={(e) => {
                        setValueLocation(e.target.value)
                    }}
                    value={valueLocation}
                >
                    <Radio value={1}>I</Radio>
                    <Radio value={2}>II</Radio>
                    <Radio value={3}>III</Radio>
                    <Radio value={4}>IV</Radio>
                </Radio.Group>
            </div>
            <div>
                <p className="text-[20px]">Số người phụ thuộc</p>
                <InputNumber
                    prefix={<UserOutlined />}
                    suffix="Người"
                    className="min-w-[500px]"
                    min={0}
                    value={valueInputNumberPersonal}
                    onChange={(value) => {
                        setValueInputNumberPersonal(Math.floor(value ?? 0))
                    }}
                    size="large"
                />
            </div>
            <Button
                type="primary"
                className="mt-5 w-[200px]"
                onClick={() => {
                    setIsOpenResult(true)
                }}
                disabled={
                    valueInputNumberIncome === 0 ||
                    valueInputNumberPersonal <= 0
                }
            >
                Tính thuế TNCN
            </Button>
            {isOpenResult && (
                <TableResults
                    salaryGross={valueInputNumberIncome}
                    socialInsurance={socialInsurance}
                    healthInsurance={healthInsurance}
                    unemploymentInsurance={unemploymentInsurance}
                    incomeBeforeTax={incomeBeforeTax}
                    personalDeduction={personalDeduction}
                    dependentDeduction={dependentDeduction}
                    taxableIncome={taxableIncome}
                    personalIncomeTax={personalIncomeTax}
                />
            )}
        </div>
    )
}

export default CalculatePersonalIncomeTaxPage

// thay đổi vùng thì Bảo hiểm thất nghiệp thay đổi
// thay đổi người phụ thuộc thì giảm trù người phụ thuộc Bảo hiểm thất nghiệp thay đổi
