import React, { useState } from "react"
import {
    Form,
    Input,
    Button,
    DatePicker,
    Space,
    Card,
    Modal,
    Upload,
    message,
    Select,
    Radio,
} from "antd"
import { jsPDF } from "jspdf"
import moment from "moment"
import html2canvas from "html2canvas"
import CvPreview from "./components/PreviewCV"
import styles from "styles/client.module.scss"
import stylesTheme from "styles/cv-theme.module.scss"
import {
    ForkOutlined,
    MailOutlined,
    UserOutlined,
    LoadingOutlined,
    PlusOutlined,
    ContactsOutlined,
} from "@ant-design/icons"
import { callUploadSingleFile } from "@/config/api"

interface IResumeData {
    basics: {
        name: string
        email: string
        image?: string
        gender?: string
        phone?: string
        address?: string
        dateofbirth?: string
    }
    work: IJob[] // Use the Job type here
    education: IEducation[] // Add the education property
    languages: ILanguage[] // Add the languages property
    skills: ISkill[] // Add the skills property
}

interface IJob {
    company: string
    position: string
    startDate: string
    endDate: string
    summary: string
}

interface IEducation {
    school: string
    degree: string
    major: string
    graduationType: string
    startDate: string
    endDate: string
    summary: string
}

interface ILanguage {
    language: string
    proficiency: string
}

interface ISkill {
    name: string
}

const CvMakerPage = () => {
    const [formData, setFormData] = useState<IResumeData | null>(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [imageUrl, setImageUrl] = useState<string | undefined>()
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false)

    const handleUploadFile = async ({ file, onSuccess, onError }: any) => {
        try {
            setLoadingUpload(true)
            const response = await callUploadSingleFile(file, "cv")
            if (response?.data) {
                const { fileName } = response.data
                const uploadedUrl = `/${fileName}`
                setImageUrl(uploadedUrl) // Cập nhật URL ảnh
                message.success("Ảnh tải lên thành công!")
                if (onSuccess) onSuccess("ok")
            } else {
                throw new Error("Upload thất bại!")
            }
        } catch (error) {
            console.error("Lỗi upload ảnh:", error)
            message.error("Không thể tải ảnh lên!")
            if (onError) onError(error)
        } finally {
            setLoadingUpload(false)
        }
    }

    const beforeUpload = (file: File) => {
        const isJpgOrPng =
            file.type === "image/jpeg" || file.type === "image/png"
        if (!isJpgOrPng) {
            message.error("Chỉ hỗ trợ file JPG/PNG!")
            return false
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
            message.error("Ảnh phải nhỏ hơn 2MB!")
            return false
        }
        return true
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const onFinish = (values: any) => {
        // Chuẩn hóa dữ liệu theo JSONResume
        const resumeData: IResumeData = {
            basics: {
                name: values.name,
                email: values.email,
                image: imageUrl,
                phone: values.phone,
                address: values.address,
                dateofbirth: values.dateofbirth.format("DD-MM-YYYY"),
                gender: values.gender,
            },
            work: values.work.map((job: IJob) => ({
                company: job.company,
                position: job.position,
                startDate: moment(job.startDate).format("YYYY-MM-DD"),
                endDate: moment(job.endDate).format("YYYY-MM-DD"),
                summary: job.summary,
            })),
            education: values.education.map((edu: IEducation) => ({
                school: edu.school,
                degree: edu.degree,
                major: edu.major,
                graduationType: edu.graduationType,
                startDate: moment(edu.startDate).format("YYYY-MM-DD"),
                endDate: moment(edu.endDate).format("YYYY-MM-DD"),
                summary: edu.summary,
            })),
            languages: values.languages.map((lang: ILanguage) => ({
                language: lang.language,
                proficiency: lang.proficiency,
            })),
            skills: values.skills.map((skill: ISkill) => ({
                name: skill.name,
            })),
        }

        setFormData(resumeData)
        console.log("CV Data:", resumeData)
        setIsModalVisible(true)
    }

    const exportToPDF = async () => {
        if (!formData) return

        const element = document.querySelector(
            `.${stylesTheme["cv-container"]}`
        ) as HTMLElement
        if (!element) {
            message.error("Không có dữ liệu để xuất PDF!")
            return
        }

        try {
            // Ensure all images are loaded
            const images = element.querySelectorAll("img")
            const imagePromises = Array.from(images).map((img) => {
                return new Promise<void>((resolve, reject) => {
                    if (img.complete) {
                        resolve()
                    } else {
                        img.onload = () => resolve()
                        img.onerror = () =>
                            reject(new Error("Image load error"))
                    }
                })
            })

            await Promise.all(imagePromises)

            const canvas = await html2canvas(element, {
                allowTaint: true,
                useCORS: true,
                logging: true,
                scale: 2, // Increase the scale for better quality
            })

            const imgData = canvas.toDataURL("image/png")
            console.log("imgData", imgData)
            const pdf = new jsPDF("p", "mm", "a4")
            const imgWidth = 190
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight)
            pdf.save("resume.pdf")
        } catch (error) {
            console.error("Lỗi xuất PDF:", error)
            message.error("Không thể xuất PDF!")
        }
    }
    const educationOptions = [
        { label: "Bằng Cử nhân", value: "Bằng cử nhân" },
        { label: "Bằng Thạc sĩ", value: "Bằng thạc sĩ" },
        { label: "Bằng Tiến sĩ", value: "Bằng tiến sĩ" },
    ]

    const graduationTypes = [
        { label: "Khá", value: "Khá" },
        { label: "Giỏi", value: "Giỏi" },
        { label: "Trung bình", value: "Trung bình" },
        { label: "Xuất sắc", value: "Xuất sắc" },
    ]

    return (
        <div className={styles["container"]} style={{ padding: 20 }}>
            <Card title="Tạo CV Của Bạn" style={{ marginBottom: 20 }}>
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        work: [{ company: "", position: "", summary: "" }],
                        education: [
                            {
                                school: "",
                                degree: null,
                                major: "",
                                graduationType: null,
                                summary: "",
                            },
                        ],
                        languages: [{ language: "", proficiency: "" }],
                        skills: [{ name: "" }],
                    }}
                >
                    {/* <Form.Item label="Ảnh đại diện">
            <Upload
              style={{ zIndex: 1 }}
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              customRequest={handleUploadFile}
              beforeUpload={beforeUpload}
            >
              {imageUrl ? (
                <img
                  src={`${
                    import.meta.env.VITE_BACKEND_URL
                  }/images/cv/${imageUrl}`}
                  alt="avatar"
                  style={{ width: "100%", zIndex: "1" }}
                  id="avatar"
                />
              ) : (
                <div>
                  {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>Tải ảnh</div>
                </div>
              )}
            </Upload>
          </Form.Item> */}
                    {/* Thông tin cơ bản */}
                    <Form.Item
                        label={
                            <span>
                                <UserOutlined style={{ marginRight: 8 }} /> Họ
                                và tên
                            </span>
                        }
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập họ và tên!",
                            },
                        ]}
                    >
                        <Input placeholder="Họ và tên" />
                    </Form.Item>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Form.Item
                            label={
                                <span>
                                    <MailOutlined style={{ marginRight: 8 }} />{" "}
                                    Email
                                </span>
                            }
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập email!",
                                },
                                {
                                    type: "email",
                                    message:
                                        "Vui lòng nhập đúng định dạng email!",
                                },
                            ]}
                            style={{ width: "48%" }}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            label={
                                <span>
                                    <ContactsOutlined
                                        style={{ marginRight: 8 }}
                                    />{" "}
                                    Số điện thoại
                                </span>
                            }
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập số điện thoại!",
                                },
                            ]}
                            style={{ width: "48%" }}
                        >
                            <Input placeholder="Số điện thoại" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập địa chỉ!",
                            },
                        ]}
                    >
                        <Input placeholder="Địa chỉ" />
                    </Form.Item>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Form.Item
                            label="Ngày sinh"
                            name="dateofbirth"
                            className="w-1/2"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập ngày sinh!",
                                },
                            ]}
                        >
                            <DatePicker
                                placeholder="Ngày sinh"
                                className="w-full"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Giới tính"
                            name="gender"
                            className="w-1/2 ml-10"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn giới tính",
                                },
                            ]}
                        >
                            <Radio.Group>
                                <Radio value="Nam">Nam</Radio>
                                <Radio value="Nữ">Nữ</Radio>
                                <Radio value="Khác">Khác</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>

                    {/* Học vấn */}
                    <Form.Item
                        label={<span>Học vấn</span>}
                        style={{ marginBottom: 16 }}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng thêm học vấn",
                            },
                        ]}
                    >
                        <Form.List name="education">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(
                                        ({ key, name, ...restField }) => (
                                            <Space
                                                key={key}
                                                style={{
                                                    display: "flex",
                                                    marginBottom: 8,
                                                }}
                                                align="baseline"
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "school"]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng nhập tên đại học",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Đại học" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "major"]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng nhập chuyên ngành",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Chuyên ngành" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "degree"]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng nhập bằng cấp",
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        className="min-w-[200px]"
                                                        placeholder="Loại bằng cấp"
                                                        allowClear
                                                    >
                                                        {educationOptions.map(
                                                            (type) => (
                                                                <Select.Option
                                                                    key={
                                                                        type.value
                                                                    }
                                                                    value={
                                                                        type.value
                                                                    }
                                                                >
                                                                    {type.label}
                                                                </Select.Option>
                                                            )
                                                        )}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[
                                                        name,
                                                        "graduationType",
                                                    ]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng nhập loại tốt nghiệp",
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        className="min-w-[200px]"
                                                        placeholder="Loại tốt nghiệp"
                                                        allowClear
                                                    >
                                                        {graduationTypes.map(
                                                            (type) => (
                                                                <Select.Option
                                                                    key={
                                                                        type.value
                                                                    }
                                                                    value={
                                                                        type?.value
                                                                    }
                                                                >
                                                                    {type.label}
                                                                </Select.Option>
                                                            )
                                                        )}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "startDate"]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Ngày bắt đầu",
                                                        },
                                                    ]}
                                                >
                                                    <DatePicker placeholder="Ngày bắt đầu học" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "endDate"]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Ngày kết thúc học",
                                                        },
                                                    ]}
                                                >
                                                    <DatePicker placeholder="Ngày kết thúc" />
                                                </Form.Item>
                                                <Button
                                                    onClick={() => remove(name)}
                                                >
                                                    Xóa
                                                </Button>
                                            </Space>
                                        )
                                    )}
                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                        >
                                            Thêm học vấn
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form.Item>

                    {/* Ngoại ngữ */}
                    <Form.Item
                        label={<span>Ngoại ngữ</span>}
                        style={{ marginBottom: 16 }}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng thêm ngoại ngữ",
                            },
                        ]}
                    >
                        <Form.List name="languages">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(
                                        ({ key, name, ...restField }) => (
                                            <Space
                                                key={key}
                                                style={{
                                                    display: "flex",
                                                    marginBottom: 8,
                                                }}
                                                align="baseline"
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "language"]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng nhập tên ngoại ngữ",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Ngoại ngữ" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "proficiency"]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng nhập trình độ",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Trình độ" />
                                                </Form.Item>
                                                <Button
                                                    onClick={() => remove(name)}
                                                >
                                                    Xóa
                                                </Button>
                                            </Space>
                                        )
                                    )}
                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                        >
                                            Thêm ngoại ngữ
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form.Item>

                    {/* Kỹ năng */}
                    <Form.Item
                        label={<span>Kỹ năng</span>}
                        style={{ marginBottom: 16 }}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng thêm kỹ năng",
                            },
                        ]}
                    >
                        <Form.List name="skills">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(
                                        ({ key, name, ...restField }) => (
                                            <Space
                                                key={key}
                                                style={{
                                                    display: "flex",
                                                    marginBottom: 8,
                                                }}
                                                align="baseline"
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "name"]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng nhập tên kỹ năng",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Kỹ năng" />
                                                </Form.Item>
                                                <Button
                                                    onClick={() => remove(name)}
                                                >
                                                    Xóa
                                                </Button>
                                            </Space>
                                        )
                                    )}
                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                        >
                                            Thêm kỹ năng
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form.Item>

                    {/* Kinh nghiệm làm việc */}
                    <Form.Item
                        label={<span>Kinh nghiệm làm việc</span>}
                        style={{ marginBottom: 16 }}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng thêm kinh nghiệm làm việc",
                            },
                        ]}
                    >
                        <Form.List name="work">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(
                                        ({ key, name, ...restField }) => (
                                            <Space
                                                key={key}
                                                style={{
                                                    display: "flex",
                                                    marginBottom: 8,
                                                }}
                                                align="baseline"
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "company"]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng nhập tên công ty",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Công ty" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "position"]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng nhập vị trí",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Vị trí" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "startDate"]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Ngày bắt đầu",
                                                        },
                                                    ]}
                                                >
                                                    <DatePicker placeholder="Ngày bắt đầu" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "endDate"]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Ngày kết thúc",
                                                        },
                                                    ]}
                                                >
                                                    <DatePicker placeholder="Ngày kết thúc" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "summary"]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng nhập mô tả công việc",
                                                        },
                                                    ]}
                                                >
                                                    <Input.TextArea
                                                        placeholder="Mô tả công việc"
                                                        rows={1}
                                                    />
                                                </Form.Item>
                                                <Button
                                                    onClick={() => remove(name)}
                                                >
                                                    Xóa
                                                </Button>
                                            </Space>
                                        )
                                    )}
                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                        >
                                            Thêm kinh nghiệm làm việc
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form.Item>

                    {/* Submit Button */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Tạo CV cho bạn
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {/* Hiển thị và tải PDF */}
            {/* Modal for CV Preview */}
            <Modal
                title="CV Preview"
                open={isModalVisible}
                onCancel={handleCancel}
                width="50%"
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Đóng
                    </Button>,
                    <Button key="export" type="primary" onClick={exportToPDF}>
                        Xuất file PDF
                    </Button>,
                ]}
            >
                {formData && <CvPreview formData={formData} />}
            </Modal>
        </div>
    )
}

export default CvMakerPage