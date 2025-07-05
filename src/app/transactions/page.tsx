import Navbar from "@/src/components/navbar/navbar";

export default function TransactionsPage() {
    return (
        <div className="text-3xl text-center bg-white w-full h-screen">
            <Navbar />
            <div className="flex flex-col items-center mt-10">
                <div className="w-[60%] flex flex-col items-center">
                    <h1 className="w-full text-4xl font-bold text-gray-800 mb-6 py-3 text-start">
                        Transactions
                    </h1>
                    <table className="text-left shadow-lg rounded-2xl rounded-tl-2xl rounded-tr-2xl overflow-hidden">
                        <thead>
                            <tr className='text-lg bg-gray-200'>
                                <th className='text-nowrap p-2 text-center text-black text-shadow-gray-900 font-light text-xl  w-1/12'>
                                    Date
                                </th>
                                <th className='text-nowrap p-2 text-center text-black text-shadow-gray-900 font-light text-xl max-w-[200px]'>
                                    Description
                                </th>
                                <th className='text-nowrap p-2 text-center text-black text-shadow-gray-900 font-light text-xl  w-1/12'>
                                    Category
                                </th>
                                <th className='text-nowrap p-2 text-center text-black text-shadow-gray-900 font-light text-xl  w-1/12'>
                                    Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody className='text-lg text-[#747474]'>
                            <tr className='hover:bg-gray-100 transition-colors duration-200'>
                                <td className='p-2 text-nowrap text-center'>2023-10-01</td>
                                <td className='p-2 text-center'>Grocery shopping at local market</td>
                                <td className='p-2 text-center'>Groceries</td>
                                <td className='p-2 text-center'>-$50.00</td>
                            </tr>
                            <tr className='hover:bg-gray-100 transition-colors duration-200'>
                                <td className='p-2 text-center'>2023-10-02</td>
                                <td className='p-2 text-center'>Salary deposit</td>
                                <td className='p-2 text-center'>Income</td>
                                <td className='p-2 text-center'>$2000.00</td>
                            </tr>
                            <tr className='hover:bg-gray-100 transition-colors duration-200'>
                                <td className='p-2 text-center'>2023-10-03</td>
                                <td className='p-2 text-center'>Utility bill payment</td>
                                <td className='p-2 text-center'>Utilities</td>
                                <td className='p-2 text-center'>-$120.00</td>
                            </tr>
                            <tr className='hover:bg-gray-100 transition-colors duration-200'>
                                <td className='p-2 text-center'>2023-10-04</td>
                                <td className='p-2 text-center'>Dining out with friends</td>
                                <td className='p-2 text-center'>Dining</td>
                                <td className='p-2 text-center'>-$75.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}