import React from "react";

const TableResults = ({
  salaryGross,
  socialInsurance,
  healthInsurance,
  unemploymentInsurance,
  incomeBeforeTax,
  personalDeduction,
  dependentDeduction,
  taxableIncome,
  personalIncomeTax,
}: {
  salaryGross: number;
  socialInsurance: number;
  healthInsurance: number;
  unemploymentInsurance: number;
  incomeBeforeTax: number;
  personalDeduction: number;
  dependentDeduction: number;
  taxableIncome: number;
  personalIncomeTax: number;
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 mb-4">
        <tbody>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">Lương GROSS</td>
            <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(salaryGross)}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">Bảo hiểm xã hội (8%)</td>
            <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(socialInsurance)}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">Bảo hiểm y tế (1.5%)</td>
            <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(healthInsurance)}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">Bảo hiểm thất nghiệp (1%)</td>
            <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(unemploymentInsurance)}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">Thu nhập trước thuế</td>
            <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(incomeBeforeTax)}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">Giảm trừ gia cảnh bản thân</td>
            <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(personalDeduction)}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">Giảm trừ người phụ thuộc</td>
            <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(dependentDeduction)}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">Thu nhập chịu thuế</td>
            <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(taxableIncome)}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">Thuế thu nhập cá nhân (*)</td>
            <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(personalIncomeTax)}</td>
          </tr>
        </tbody>
      </table>
      <p className="text-sm text-gray-500 mb-2">(*) Chi tiết thuế thu nhập cá nhân (VNĐ)</p>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mức chịu thuế</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thuế suất</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiền nộp</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">Đến 5 triệu VNĐ</td>
            <td className="px-6 py-4 whitespace-nowrap">5%</td>
            <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(250000)}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">Trên 5 triệu VNĐ đến 10 triệu VNĐ</td>
            <td className="px-6 py-4 whitespace-nowrap">10%</td>
            <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(500000)}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">Trên 10 triệu VNĐ đến 18 triệu VNĐ</td>
            <td className="px-6 py-4 whitespace-nowrap">15%</td>
            <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(1200000)}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">Trên 18 triệu VNĐ đến 32 triệu VNĐ</td>
            <td className="px-6 py-4 whitespace-nowrap">20%</td>
            <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(2800000)}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">Trên 32 triệu VNĐ đến 52 triệu VNĐ</td>
            <td className="px-6 py-4 whitespace-nowrap">25%</td>
            <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(5000000)}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">Trên 52 triệu VNĐ đến 80 triệu VNĐ</td>
            <td className="px-6 py-4 whitespace-nowrap">30%</td>
            <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(8239200)}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">Trên 80 triệu</td>
            <td className="px-6 py-4 whitespace-nowrap">35%</td>
            <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TableResults;