import { Form, Input, Button, Divider, notification } from "antd"
import { LockOutlined, KeyOutlined } from "@ant-design/icons"
import { useState } from "react"
import { useLocation } from "react-router-dom" // Import useLocation
import { callForgotPassword } from "config/api" // Giả sử bạn có một hàm API để xử lý yêu cầu thay đổi mật khẩu
import { Link, useNavigate } from "react-router-dom"
const ChangePasswordPage = () => {
    const [isSubmit, setIsSubmit] = useState(false)
    const [form] = Form.useForm()
    const location = useLocation()
    const otp = location.state?.otp || null
    const curEmail = location.state?.email || null
    const navigate = useNavigate()
    const validateOtp = (_: any, value: any) => {
        if (value === otp) {
            return Promise.resolve()
        }
        return Promise.reject(new Error("Mã xác nhận không đúng!"))
    }

    const onFinish = async (values: {
        newPassword: string
        confirmPassword: string
        code: string
    }) => {
        const { newPassword, confirmPassword, code } = values
        setIsSubmit(true)

        try {
            // Gọi hàm API để xử lý yêu cầu thay đổi mật khẩu
            const response = await callForgotPassword(
                code,
                newPassword,
                confirmPassword,
                curEmail
            )

            if (response?.data?.isBeforeCheck) {
                notification.success({
                    message: "Thành công",
                    description: "Mật khẩu đã được thay đổi thành công.",
                    duration: 5,
                })
                form.resetFields()
                navigate("/login")
            } else {
                notification.error({
                    message: "Lỗi",
                    description: "Đã xảy ra lỗi.",
                    duration: 5,
                })
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
                duration: 5,
            })
        } finally {
            setIsSubmit(false)
        }
    }

    return (
        <div className="text-black bg-light">
            <main>
                <div className="flex justify-center items-center min-h-screen px-8 mx-auto">
                    <section className="max-w-[28rem] w-full p-8 px-10 rounded-lg text-black shadow-large bg-white">
                        <h2 className="text-[2rem] font-[600] text-center">
                            Khôi phục mật khẩu
                        </h2>
                        <Divider />
                        <Form
                            name="change_password"
                            className="w-full h-auto"
                            onFinish={onFinish} // Bật chức năng gửi biểu mẫu
                            autoComplete="off"
                            form={form}
                        >
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Mã xác nhận"
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Mã xác nhận không được để trống!",
                                    },
                                    {
                                        validator: validateOtp,
                                    },
                                ]}
                            >
                                <Input.Password
                                    className="p-2"
                                    prefix={<KeyOutlined />}
                                    placeholder="Mã xác nhận"
                                />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Mật khẩu mới"
                                name="newPassword"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Mật khẩu mới không được để trống!",
                                    },
                                    {
                                        pattern:
                                            /^(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{6,}$/,
                                        message:
                                            "Mật khẩu phải chứa ít nhất 6 ký tự và 1 ký tự đặc biệt",
                                    },
                                ]}
                            >
                                <Input.Password
                                    className="p-2"
                                    prefix={<LockOutlined />}
                                    placeholder="Mật khẩu mới"
                                />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Xác nhận mật khẩu mới"
                                name="confirmPassword"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Xác nhận mật khẩu không được để trống!",
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (
                                                !value ||
                                                getFieldValue("newPassword") ===
                                                    value
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
                            >
                                <Input.Password
                                    className="p-2"
                                    prefix={<LockOutlined />}
                                    placeholder="Xác nhận mật khẩu mới"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    block
                                    type="primary"
                                    htmlType="submit"
                                    loading={isSubmit}
                                >
                                    Thay đổi mật khẩu
                                </Button>
                            </Form.Item>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default ChangePasswordPage
