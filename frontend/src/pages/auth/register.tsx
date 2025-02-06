import {
  Image,
  Button,
  Divider,
  Form,
  Input,
  Select,
  message,
  notification,
  Checkbox,
} from "antd";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { callRegister } from "config/api";
import { IProvince, IUser } from "@/types/backend";
import axios from "axios";
const { Option } = Select;
import logo from "@/assets/Images/logo3.png";
const RegisterPage = () => {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [isAgree, setIsAgree] = useState(false);

  const [provinces, setProvinces] = useState<IProvince[]>([]);
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://provinces.open-api.vn/api/p/"
        );
        setProvinces(response.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  const onFinish = async (values: any) => {
    const { name, email, password, age, gender, province, detailedAddress } =
      values;
    const address = `${detailedAddress}, ${province}`;
    setIsSubmit(true);
    const res = await callRegister(
      name,
      email,
      password as string,
      +age,
      gender,
      address
    );
    setIsSubmit(false);
    if (res?.data?._id) {
      message.success("Đăng ký tài khoản thành công!");
      navigate("/login");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 5,
      });
    }
  };

  const handleCheckboxChange = (e: any) => {
    setIsAgree(e.target.checked);
  };

  return (
    <div className="text-black bg-light">
      <main>
        <div className="flex flex-columm justify-center items-center max-w-[80rem] min-h-screen px-8 mx-auto">
          <section className="max-w-[36rem] w-full my-8 mx-auto p-8 px-10 border-none outline-none rounded-lg text-black shadow-large bg-white">
            <div>
              <h2 className="text-[2rem] font-[600] text-black text-center">
                Đăng ký tài khoản
              </h2>
              <Divider />
            </div>
            <Form<IUser> name="basic" onFinish={onFinish} autoComplete="off">
              <Form.Item
                labelCol={{ span: 24 }}
                label="Họ tên"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Họ tên không được để trống!",
                  },
                ]}
              >
                <Input placeholder="Họ và Tên" />
              </Form.Item>

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
                    message: "Vui lòng nhập đúng định dạng email!",
                  },
                ]}
                normalize={(value) => value.trim()}
              >
                <Input placeholder="Email" type="email" />
              </Form.Item>

              <Form.Item
                labelCol={{ span: 24 }}
                label="Mật khẩu"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Mật khẩu không được để trống!",
                  },
                  {
                    pattern:
                        /^(?=.*[!@#$%^&*(),.?":{}|<>_])[a-zA-Z\d!@#$%^&*(),.?":{}|<>_]{6,}$/,
                    message:
                        "Mật khẩu phải chứa ít nhất 6 ký tự và 1 ký tự đặc biệt",
                },
                ]}
                normalize={(value) => value.trim()}
              >
                <Input.Password placeholder="Mật khẩu" />
              </Form.Item>

              <Form.Item
                labelCol={{ span: 24 }}
                label="Nhập lại mật khẩu"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Mật khẩu xác nhận không được để trống!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu xác nhận không khớp!")
                      );
                    },
                  }),
                ]}
                normalize={(value) => value.trim()}
              >
                <Input.Password placeholder="Nhập lại mật khẩu" />
              </Form.Item>

              <Form.Item
                labelCol={{ span: 24 }}
                label="Tuổi"
                name="age"
                rules={[
                  {
                    required: true,
                    message: "Tuổi không được để trống!",
                  },
                  {
                    pattern: /^[1-9]\d*$/,
                    message: "Tuổi phải là số nguyên dương!",
                  },
                ]}
              >
                <Input type="number" min={1} placeholder="Tuổi" />
              </Form.Item>

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
              >
                <Select allowClear placeholder="Giới tính">
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>

              <Form.Item
                labelCol={{ span: 24 }}
                label="Địa chỉ"
                name="address"
                required
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
                        message: "Tỉnh/Thành phố không được để trống!",
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

                  <Form.Item
                    name="detailedAddress"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: "Địa chỉ chi tiết không được để trống!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Địa chỉ chi tiết (Tên đường, số nhà, phường/xã, quận/huyện)"
                      style={{ gridColumn: "span 2" }} // Thay đổi ở đây để ô input tràn sang bên phải
                    />
                  </Form.Item>
                </div>
              </Form.Item>
              <Form.Item
                name="agreement"
                valuePropName="checked"
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  style={{ marginRight: "8px" }}
                  onChange={handleCheckboxChange}
                />
                <span>
                  Tôi đã đọc và đồng ý với các{" "}
                  <a href="#" className="text-blue">
                    Điều khoản dịch vụ
                  </a>{" "}
                  và{" "}
                  <a href="#" className="text-blue">
                    Chính sách quyền riêng tư
                  </a>{" "}
                  liên quan đến thông tin riêng tư của tôi.
                </span>
              </Form.Item>
              <Form.Item>
                <span>
                  Liên hệ chúng tôi để trở thành nhà tuyển dụng admin@gmail.com
                </span>
                <Form.Item />
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  loading={isSubmit}
                  disabled={!isAgree}
                  className={`${
                    isAgree
                      ? "transition duration-300 ease-in-out transform hover:scale-105"
                      : ""
                  }`}
                >
                  Đăng ký
                </Button>
              </Form.Item>

              <Divider>Hoặc</Divider>
              <p className="text text-normal">
                Đã có tài khoản?{" "}
                <Link className="text-blue" to="/login">
                  Đăng Nhập
                </Link>
              </p>
            </Form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
