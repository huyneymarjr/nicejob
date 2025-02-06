import { GoogleGenerativeAI } from "@google/generative-ai"
// const companyData = [
//     { name: "Công ty ABC", location: "Hà Nội", industry: "Tài chính" },
//     { name: "Công ty XYZ", location: "TP Hồ Chí Minh", industry: "Công nghệ" },
// ]

// const jobData = [
//     {
//         title: "Kỹ sư phần mềm",
//         company: "Công ty XYZ",
//         location: "Làm việc từ xa",
//     },
//     {
//         title: "Chuyên viên phân tích dữ liệu",
//         company: "Công ty ABC",
//         location: "Hà Nội",
//     },
// ]
const fetchWithTimeout = (url: string, timeout: number) => {
    return Promise.race([
        fetch(url).then(async (res) => res.json()),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timeout")), timeout)
        ),
    ])
}

async function handleCompanyQuery(query: string) {
    try {
        const companiesData: any = await fetchWithTimeout(
            "http://localhost:8000/api/v1/companies?current=1&pageSize=10",
            1000
        )
        const result = await companiesData?.data?.result
            ?.map((item: any) => ({
                name: item.name,
                address: item.address,
            }))
            .filter(
                (company: any) =>
                    query.toLowerCase().includes(company.name.toLowerCase()) &&
                    query.toLowerCase().includes("công ty")
            )

        if (result.length) {
            return `Thông tin về công ty: ${result
                .map((c: any) => `${c.name} ở ${c.address}`)
                .join(". ")}`
        }

        return "Không tìm thấy công ty phù hợp."
    } catch (error: any) {
        if (error.message === "Request timeout") {
            return "API mất quá nhiều thời gian để phản hồi (hơn 1000ms)."
        }
        return "Đã xảy ra lỗi khi lấy thông tin công ty."
    }
}

async function handleJobQuery(query: string) {
    try {
        const jobsData: any = await fetchWithTimeout(
            "http://localhost:8000/api/v1/jobs?current=1&pageSize=10",
            1000
        )
        const result = await jobsData?.data?.result
            ?.map((item: any) => ({
                name: item.name,
                company: item.company.name,
                salary: item.salary,
                quantity: item.quantity,
                level: item.level,
                location: item.location,
            }))
            .filter(
                (job: any) =>
                    query.toLowerCase().includes(job.name.toLowerCase()) &&
                    query.toLowerCase().includes("việc làm")
            )

        if (result.length) {
            return `Thông tin về việc làm: ${result
                .map(
                    (j: any) =>
                        `${j.title} tại ${j.company} có lương là ${j.salary} VNĐ, số lượng ${j.quantity} người, cấp bậc ${j.level} ở ${j.location}`
                )
                .join(". ")}`
        }

        return "Không tìm thấy việc làm phù hợp."
    } catch (error: any) {
        if (error.message === "Request timeout") {
            return "API mất quá nhiều thời gian để phản hồi (hơn 1000ms)."
        }
        return "Đã xảy ra lỗi khi lấy thông tin việc làm."
    }
}
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GG_AI_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-pro" })

const chat = model.startChat({
    history: [],
    generationConfig: {
        maxOutputTokens: 100,
    },
})
async function run(msg: any) {
    const query = msg.toLowerCase()

    if (query.includes("công ty")) {
        return handleCompanyQuery(msg)
    }

    if (query.includes("việc làm")) {
        return handleJobQuery(msg)
    }
    const msgContentUser = { role: "user", parts: [{ text: msg }] }

    chat?.params?.history?.push(msgContentUser)

    const result = await chat.sendMessageStream(msg)
    const response = await result.response
    const text = response.text()

    const msgContentModel = { role: "model", parts: [{ text: text }] }
    chat?.params?.history?.push(msgContentModel)

    return text
}

export default run
