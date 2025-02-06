import { Button, Col, Form, Row, Select, notification } from "antd"
import {
    EnvironmentOutlined,
    MonitorOutlined,
    SearchOutlined,
} from "@ant-design/icons"
import { LOCATION_LIST, SKILLS_LIST } from "@/config/utils"
import { ProForm } from "@ant-design/pro-components"
import { callSearchJobs } from "@/config/api"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
const SearchClient = () => {
    const optionsSkills = SKILLS_LIST
    const optionsLocations = LOCATION_LIST
    const [form] = Form.useForm()
    const navigate = useNavigate()
    const [isMobile, setIsMobile] = useState(false)
    const location = useLocation()

    const onFinish = async (values: any) => {
        const queryParams = new URLSearchParams()
        if (values.skills) {
            queryParams.append("skills", values.skills.join(","))
        }
        if (values.location) {
            queryParams.append("location", values.location.join(","))
        }
        navigate(`/job?${queryParams.toString()}`)
    }

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1201)
        }

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    const searchParams = new URLSearchParams(location.search)
    const skills = searchParams.get("skills")
    const locations = searchParams.get("location")
    // useEffect(() => {
    //     if (skills || locations) {
    //         form.setFieldsValue({
    //             skills: skills ? skills.split(",") : [],
    //             location: locations ? locations.split(",") : [],
    //         })
    //     }
    // }, [location.search])

    return (
        <ProForm
            form={form}
            onFinish={onFinish}
            submitter={{
                render: () => <></>,
            }}
            // thêm valueInit để giữ nguyên giá trị khi chuyển trang
            initialValues={{
                skills: skills ? skills.split(",") : [],
                location: locations ? locations.split(",") : [],
            }}
        >
            <Row gutter={[16, 16]} className="w-full max-w-[1210px]">
                <Col span={24}>
                    <h2
                        style={{
                            textAlign: "center",
                            fontSize: "1.5rem",
                            marginBottom: "1rem",
                            fontFamily: "Arial, sans-serif",
                            fontWeight: 600,
                        }}
                    >
                        Việc làm IT cho Developer "Chất"
                    </h2>
                </Col>
                {/* Địa điểm */}
                <Col xs={24} sm={24} md={6}>
                    <ProForm.Item name="location">
                        <Select
                            mode="multiple"
                            allowClear
                            className="w-full"
                            size="large"
                            placeholder={
                                <>
                                    <EnvironmentOutlined /> Địa điểm...
                                </>
                            }
                            optionLabelProp="label"
                            options={optionsLocations}
                        />
                    </ProForm.Item>
                </Col>
                <Col xs={24} sm={24} md={16}>
                    <ProForm.Item name="skills">
                        <Select
                            mode="multiple"
                            allowClear={isMobile ? false : true}
                            className="w-full"
                            size="large"
                            placeholder={
                                <>
                                    <MonitorOutlined /> Nhập từ khóa theo kỹ
                                    năng...
                                </>
                            }
                            optionLabelProp="label"
                            options={optionsSkills}
                            suffixIcon={
                                isMobile ? (
                                    <SearchOutlined
                                        style={{
                                            fontSize: "1.5rem",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => form.submit()} // Gửi form khi nhấn icon
                                    />
                                ) : null
                            }
                        />
                    </ProForm.Item>
                </Col>
                {!isMobile && (
                    <Col span={14} md={2}>
                        <Button
                            className=""
                            type="primary"
                            onClick={() => form.submit()}
                            size="large"
                            icon={<SearchOutlined />}
                            style={{
                                color: "#ffffff",
                                transition: "0.3s ease-in-out",
                            }}
                        >
                            Tìm kiếm
                        </Button>
                    </Col>
                )}
            </Row>
        </ProForm>
    )
}
export default SearchClient
