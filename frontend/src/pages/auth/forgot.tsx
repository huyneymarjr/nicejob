import { Form, Input, Button, Divider, notification } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { callRetryPassword } from "config/api";

const ForgotPasswordPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (value: any) => {
    setIsSubmit(true);
    try {
      const response = await callRetryPassword(value.email, value.codeId);

      // Assuming the API response has an 'otp' field
      if (response && response.data?.codeId) {
        notification.success({
          message: "Yêu cầu thành công",
          description: "Đã gửi OTP đến email của bạn.",
        });

        // Navigate to change-password page with OTP
        navigate("/change-password", {
          state: { otp: response.data?.codeId, email: value.email },
        });
      } else {
        notification.error({
          message: "Lỗi",
          description: "Tài khoản không tồn tại. Vui lòng đăng kí tài khoản.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="text-black bg-light">
      <main>
        <div className="flex justify-center items-center min-h-screen px-8 mx-auto">
          <section className="max-w-[28rem] w-full p-8 px-10 rounded-lg text-black shadow-large bg-white">
            <h2 className="text-[2rem] font-[600] text-center">
              Quên mật khẩu
            </h2>
            <Divider />
            <p className="text-center mb-6">
              Vui lòng nhập email của bạn để nhận mã khôi phục mật khẩu.
            </p>
            <Form
              name="forgot_password"
              className="w-full h-auto"
              onFinish={onFinish}
              autoComplete="off"
              form={form}
            >
              <Form.Item
                labelCol={{ span: 24 }}
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Email không được để trống!",
                  },
                  {
                    type: "email",
                    message: "Email không hợp lệ!",
                  },
                ]}
              >
                <Input
                  className="p-2"
                  prefix={<UserOutlined />}
                  placeholder="Email"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  loading={isSubmit}
                >
                  Gửi yêu cầu
                </Button>
              </Form.Item>
              <Divider />
              <p className="text-center">
                <Link to="/login" className="text-blue">
                  Trở lại trang đăng nhập
                </Link>
              </p>
            </Form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
