import {
    Button,
    Col,
    Form,
    Modal,
    Row,
    Select,
    Table,
    Tabs,
    message,
    notification,
    Input,
    InputNumber,
    Spin,
} from "antd"
import { EditOutlined } from "@ant-design/icons"
import { isMobile } from "react-device-detect"
import type { TabsProps } from "antd"
import { IProvince, IResume } from "@/types/backend"
import { useState, useEffect } from "react"
import {
    callFetchResumeByUser,
    callGetSubscriberSkills,
    callUpdateSubscriber,
    callChangePassword,
    callUpdateProfile,
    callFetchProfile,
} from "@/config/api"
import type { ColumnsType } from "antd/es/table"
import dayjs from "dayjs"
import { MonitorOutlined, LockOutlined } from "@ant-design/icons"
import { SKILLS_LIST } from "@/config/utils"
import { useAppSelector } from "@/redux/hooks"
import { useAppDispatch } from "@/redux/hooks"
import { userInfo } from "os"
import { useDispatch } from "react-redux"
import { updateUserName } from "@/redux/slice/accountSlide"
import axios from "axios"
const { Option } = Select
interface IProps {
    open: boolean
    onClose: (v: boolean) => void
}

const UserResume = (props: any) => {
    const [listCV, setListCV] = useState<IResume[]>([])
    const [isFetching, setIsFetching] = useState<boolean>(false)

    useEffect(() => {
        const init = async () => {
            setIsFetching(true)
            const res = await callFetchResumeByUser()
            if (res && res.data) {
                setListCV(res.data as IResume[])
            }
            setIsFetching(false)
        }
        init()
    }, [])
    const columns: ColumnsType<IResume> = [
        {
            title: "STT",
            key: "index",
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return <>{index + 1}</>
            },
        },
        {
            title: "Công Ty",
            dataIndex: ["companyId", "name"],
        },
        {
            title: "Vị trí",
            dataIndex: ["jobId", "name"],
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
        },
        {
            title: "Ngày gửi CV",
            dataIndex: "createdAt",
            render(value, record, index) {
                return (
                    <>{dayjs(record.createdAt).format("DD-MM-YYYY HH:mm:ss")}</>
                )
            },
        },
        {
            title: "",
            dataIndex: "",
            render(value, record, index) {
                return (
                    <a
                        href={`${
                            import.meta.env.VITE_BACKEND_URL
                        }/images/resume/${record?.url}`}
                        target="_blank"
                    >
                        Chi tiết
                    </a>
                )
            },
        },
    ]

    return (
        <div>
            <Table<IResume>
                columns={columns}
                dataSource={listCV}
                loading={isFetching}
                pagination={false}
            />
        </div>
    )
}

const UserUpdateInfo = (props: any) => {
    const [form] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true)
                const res = await callFetchProfile()
                if (res?.data) {
                    const addressParts = res.data.address.split(", ")
                    const detailedAddress = addressParts.slice(0, -1).join(", ")
                    const province = addressParts.slice(-1)[0]

                    form.setFieldsValue({
                        ...res.data,
                        province,
                        detailedAddress,
                    })
                }
            } catch (error) {
                message.error("Không thể tải thông tin cá nhân")
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [form])

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get(
                    "https://provinces.open-api.vn/api/p/"
                )
                setProvinces(response.data)
            } catch (error) {
                console.error("Error fetching provinces:", error)
            }
        }

        fetchProvinces()
    }, [])
    const handleSubmit = async (values: any) => {
        const { name, age, gender, province, detailedAddress } = values
        const address = `${detailedAddress}, ${province}`
        setIsSubmit(true)
        try {
            const res = await callUpdateProfile(name, age, gender, address)
            if (res?.data) {
                console.log(res.data)
                message.success("Cập nhật thông tin thành công!")
                dispatch(updateUserName({ name: values.name }))
            } else {
                message.error("Cập nhật thất bại. Vui lòng thử lại!")
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi cập nhật thông tin!")
        } finally {
            setIsSubmit(false)
        }
    }

    const [provinces, setProvinces] = useState<IProvince[]>([])

    return (
        <Spin spinning={isLoading}>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                {" "}
                {/* Sử dụng layout vertical */}
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <Form.Item
                            name="name"
                            label="Họ tên"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập họ tên!",
                                },
                            ]} // Thêm validation
                            style={{ marginBottom: 0 }} // Thêm style để loại bỏ khoảng cách
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[]} // Thêm validation
                            style={{ marginBottom: 0 }}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="age"
                            label="Tuổi"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập tuổi!",
                                },
                            ]} // Thêm validation
                            style={{ marginBottom: 0 }}
                        >
                            <InputNumber className="w-full" type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            name="gender"
                            label="Giới tính"
                            rules={[
                                {
                                    required: true,
                                    message: "Giới tính không được để trống!",
                                },
                            ]}
                            style={{ marginBottom: 0 }}
                        >
                            <Select allowClear>
                                <Option value="male" selected>
                                    Nam
                                </Option>
                                <Option value="female">Nữ</Option>
                                <Option value="other">Khác</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Địa chỉ"
                            name="address"
                            required
                            style={{ marginBottom: 0 }}
                        >
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3, 1fr)",
                                    gap: "8px",
                                }}
                            >
                                <Form.Item
                                    name="province"
                                    noStyle
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Tỉnh/Thành phố không được để trống!",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Tỉnh/Thành phố">
                                        {provinces.map((province) => (
                                            <Option
                                                key={province.code}
                                                value={province.name}
                                                code={province.code}
                                            >
                                                {province.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item name="detailedAddress" noStyle>
                                    <Input
                                        placeholder="Địa chỉ (Tên đường, số nhà, phường/xã, quận/huyện)"
                                        style={{ gridColumn: "span 2" }} // Thay đổi ở đây để ô input tràn sang bên phải
                                    />
                                </Form.Item>
                            </div>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isSubmit}
                            >
                                Cập nhật thông tin
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Spin>
    )
}

const JobByEmail = (props: any) => {
    const [form] = Form.useForm()
    const user = useAppSelector((state) => state.account.user)

    useEffect(() => {
        const init = async () => {
            const res = await callGetSubscriberSkills()
            if (res && res.data) {
                form.setFieldValue("skills", res.data.skills)
            }
        }
        init()
    }, [])

    const onFinish = async (values: any) => {
        const { skills } = values
        const res = await callUpdateSubscriber({
            email: user.email,
            name: user.name,
            skills: skills ? skills : [],
        })
        if (res.data) {
            message.success("Cập nhật thông tin thành công")
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message,
            })
        }
    }

    return (
        <>
            <Form onFinish={onFinish} form={form}>
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <Form.Item
                            label={"Kỹ năng"}
                            name={"skills"}
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn ít nhất 1 skill!",
                                },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                showArrow={false}
                                style={{ width: "100%" }}
                                placeholder={
                                    <>
                                        <MonitorOutlined /> Tìm theo kỹ năng...
                                    </>
                                }
                                optionLabelProp="label"
                                options={SKILLS_LIST}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Button type="primary" onClick={() => form.submit()}>
                            Nhận thông báo
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}
const ChangePassword = (props: any) => {
    const [form] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false)

    const onFinish = async (values: any) => {
        const { currentPassword, newPassword, confirmPassword } = values
        setIsSubmit(true)
        try {
            const res = await callChangePassword(
                currentPassword,
                newPassword,
                confirmPassword
            )
            if (res.data) {
                message.success("Thay đổi mật khẩu thành công")
                form.resetFields()
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: res.message,
                })
            }
        } catch (error) {
            notification.error({
                message: "Có lỗi xảy ra",
                description: "Vui lòng thử lại sau",
            })
        } finally {
            setIsSubmit(false)
        }
    }

    return (
        <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            className="w-full"
        >
            {" "}
            {/* Sử dụng layout vertical */}
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <Form.Item
                        label={"Mật khẩu hiện tại"}
                        name={"currentPassword"}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mật khẩu hiện tại!",
                            },
                        ]}
                        style={{ marginBottom: 0 }} // Thêm style để loại bỏ khoảng cách
                    >
                        <Input.Password />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        label={"Mật khẩu mới"}
                        name={"newPassword"}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mật khẩu mới!",
                            },
                            {
                                pattern:
                                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_])[A-Za-z\d!@#$%^&*(),.?":{}|<>_]{6,}$/,
                                message:
                                    "Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm chữ, số và 1 ký tự đặc biệt",
                            },
                        ]}
                        style={{ marginBottom: 0 }} // Thêm style để loại bỏ khoảng cách
                    >
                        <Input.Password />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        label={"Xác nhận mật khẩu mới"}
                        name={"confirmPassword"}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng xác nhận mật khẩu mới!",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue("newPassword") === value
                                    ) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(
                                        new Error(
                                            "Mật khẩu xác nhận không khớp!"
                                        )
                                    )
                                },
                            }),
                        ]}
                        style={{ marginBottom: 0 }} // Thêm style để loại bỏ khoảng cách
                    >
                        <Input.Password />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item style={{ marginBottom: 0 }}>
                        {" "}
                        {/* Thêm style để loại bỏ khoảng cách */}
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isSubmit}
                        >
                            Thay đổi mật khẩu
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}
const ManageAccount = (props: IProps) => {
    const { open, onClose } = props
    const user = useAppSelector((state) => state.account.user)
    const onChange = (key: string) => {
        // console.log(key);
    }

    const items = [
        {
            key: "user-resume",
            label: `Danh sách CV đã gửi`,
            children: <UserResume />,
            permission: user?.role?.name !== "HR",
        },
        {
            key: "email-by-skills",
            label: `Thông báo việc làm qua email`,
            children: <JobByEmail />,
            permission: true,
        },
        {
            key: "user-update-info",
            label: `Cập nhật thông tin`,
            children: <UserUpdateInfo />,
            permission: true,
        },
        {
            key: "user-password",
            label: `Thay đổi mật khẩu`,
            children: <ChangePassword />,
            permission: true,
        },
    ].filter((item) => item.permission)

    return (
        <>
            <Modal
                title="Quản lý tài khoản"
                open={open}
                onCancel={() => onClose(false)}
                maskClosable={false}
                footer={null}
                destroyOnClose={true}
                width={isMobile ? "100%" : "1000px"}
            >
                <div style={{ minHeight: 400 }}>
                    <Tabs
                        defaultActiveKey={
                            user?.role?.name === "HR"
                                ? "email-by-skills"
                                : "user-resume"
                        }
                        items={items}
                        onChange={onChange}
                    />
                </div>
            </Modal>
        </>
    )
}

export default ManageAccount
