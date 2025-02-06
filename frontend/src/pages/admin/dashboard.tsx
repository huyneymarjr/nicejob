import { Card, Col, Row, Statistic } from "antd"
import CountUp from "react-countup"
import { Column, Line } from "@ant-design/charts"
import LineChart from "@/components/admin/dashboard/lineChart"
import { useEffect, useState } from "react"
import {
    dashboardCompany,
    dashboardJob,
    dashboardResume,
    dashboardUser,
} from "@/config/api"
const DashboardPage = () => {
    const formatter = (value: number | string) => {
        return <CountUp end={Number(value)} separator="," />
    }
    const dataLine = [
        { date: "2024-01-01", value: 20, type: "Premium" },
        { date: "2024-01-01", value: 32, type: "Free" },
        { date: "2024-01-02", value: 50, type: "Premium" },
        { date: "2024-01-02", value: 60, type: "Free" },
        { date: "2024-01-03", value: 58, type: "Premium" },
        { date: "2024-01-03", value: 70, type: "Free" },
        { date: "2024-01-04", value: 67, type: "Premium" },
        { date: "2024-01-04", value: 54, type: "Free" },
        { date: "2024-01-05", value: 72, type: "Premium" },
        { date: "2024-01-05", value: 80, type: "Free" },
        { date: "2024-01-06", value: 33, type: "Premium" },
        { date: "2024-01-06", value: 45, type: "Free" },
        { date: "2024-01-07", value: 88, type: "Premium" },
        { date: "2024-01-07", value: 54, type: "Free" },
    ]
    const [dataUser, setDataUser] = useState<any>({})
    const [dataCompany, setDataCompany] = useState<any>({})
    const [dataJob, setDataJob] = useState<any>({})
    const [dataResume, setDataResume] = useState<any>({})
    const fetchDataUser = async () => {
        try {
            const data = await dashboardUser()
            if (data.data) setDataUser(data.data)
        } catch (error) {
            console.log(error)
        }
    }
    const fetchDataCompany = async () => {
        try {
            const data = await dashboardCompany()
            if (data.data) setDataCompany(data.data)
        } catch (error) {
            console.log(error)
        }
    }
    const fetchDataJob = async () => {
        try {
            const data = await dashboardJob()
            if (data.data) setDataJob(data.data)
        } catch (error) {
            console.log(error)
        }
    }
    const fetchDataResume = async () => {
        try {
            const data = await dashboardResume()
            if (data.data) setDataResume(data.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchDataUser()
        fetchDataCompany()
        fetchDataJob()
        fetchDataResume()
    }, [])
    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24} md={6}>
                    <Card title="Tổng số người dùng" bordered={false}>
                        <Statistic
                            title="Tổng số người dùng hiện tại"
                            value={dataUser?.totalUser ?? 0}
                            formatter={formatter}
                        />
                        <Statistic
                            title="Tổng số người dùng đã xóa"
                            value={dataUser?.totalUserDeleted ?? 0}
                            formatter={formatter}
                        />
                    </Card>
                </Col>
                <Col span={24} md={6}>
                    <Card title="Tổng số công ty" bordered={false}>
                        <Statistic
                            title="Tổng số công ty hiện tại"
                            value={dataCompany?.totalCompany ?? 0}
                            formatter={formatter}
                        />
                        <Statistic
                            title="Tổng số công ty đã xóa"
                            value={dataCompany?.totalCompanyDeleted ?? 0}
                            formatter={formatter}
                        />
                    </Card>
                </Col>
                <Col span={24} md={6}>
                    <Card title="Tổng số việc làm" bordered={false}>
                        <Statistic
                            title="Tổng số việc làm hiện tại"
                            value={dataJob?.totalJobs ?? 0}
                            formatter={formatter}
                        />
                        <Statistic
                            title="Tổng số việc làm đã xóa"
                            value={dataJob?.totalJobsDeleted ?? 0}
                            formatter={formatter}
                        />
                    </Card>
                </Col>
                <Col span={24} md={6}>
                    <Card title="Tổng số hồ sơ" bordered={false}>
                        <Statistic
                            title="Tổng số hồ sơ hiện tại"
                            value={dataResume?.totalResumes ?? 0}
                            formatter={formatter}
                        />
                        <Statistic
                            title="Tổng số hồ sơ đã xóa"
                            value={dataResume?.totalResumesDeleted ?? 0}
                            formatter={formatter}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default DashboardPage
