import {
    Breadcrumb,
    Col,
    ConfigProvider,
    Divider,
    Form,
    Row,
    message,
    notification,
} from "antd"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { DebounceSelect } from "../user/debouce.select"
import {
    FooterToolbar,
    ProForm,
    ProFormDatePicker,
    ProFormDigit,
    ProFormSelect,
    ProFormSwitch,
    ProFormText,
} from "@ant-design/pro-components"
import styles from "styles/admin.module.scss"
import { LOCATION_LIST, SKILLS_LIST } from "@/config/utils"
import { ICompanySelect } from "../user/modal.user"
import { useState, useEffect } from "react"
import {
    callCreateJob,
    callFetchCompany,
    callFetchJobById,
    callUpdateJob,
} from "@/config/api"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { CheckSquareOutlined } from "@ant-design/icons"
import enUS from "antd/lib/locale/en_US"
import dayjs from "dayjs"
import weekday from "dayjs/plugin/weekday"
dayjs.extend(weekday)
import { IJob } from "@/types/backend"
import { useAppSelector } from "@/redux/hooks"

const ViewUpsertJob = (props: any) => {
    const [companies, setCompanies] = useState<ICompanySelect[]>([])

    const navigate = useNavigate()
    const [value, setValue] = useState<string>("")

    let location = useLocation()
    let params = new URLSearchParams(location.search)
    const id = params?.get("id") // job id
    const [dataUpdate, setDataUpdate] = useState<IJob | null>(null)
    const [form] = Form.useForm()

    const user = useAppSelector((state) => state.account.user)

    useEffect(() => {
        const init = async () => {
            if (id) {
                const res = await callFetchJobById(id)
                if (res && res.data) {
                    setDataUpdate(res.data)
                    setValue(res.data.description)
                    setCompanies([
                        {
                            label: res.data.company?.name as string,
                            value: `${res.data.company?._id}@#$${res.data.company?.logo}` as string,
                            key: res.data.company?._id,
                        },
                    ])

                    form.setFieldsValue({
                        ...res.data,
                        company: {
                            label: res.data.company?.name as string,
                            value: `${res.data.company?._id}@#$${res.data.company?.logo}` as string,
                            key: res.data.company?._id,
                        },
                    })
                }
            }
        }
        init()
        return () => form.resetFields()
    }, [id])

    // Usage of DebounceSelect
    async function fetchCompanyList(name: string): Promise<ICompanySelect[]> {
        const res = await callFetchCompany(
            `current=1&pageSize=100&name=/${name}/i`
        )
        if (res && res.data) {
            const list = res.data.result
            if (user?.role?.name === "HR" && user?.company?._id) {
                return list
                    .filter((item) => item._id === user?.company?._id)
                    .map((item) => {
                        return {
                            label: item.name as string,
                            value: `${item._id}@#$${item.logo}` as string,
                        }
                    })
            } else {
                const temp = list.map((item) => {
                    return {
                        label: item.name as string,
                        value: `${item._id}@#$${item.logo}` as string,
                    }
                })
                return temp
            }
        } else return []
    }

    const onFinish = async (values: any) => {
        if (dataUpdate?._id) {
            //update
            const cp = values?.company?.value?.split("@#$")
            const job = {
                name: values.name,
                skills: values.skills,
                company: {
                    _id: cp && cp.length > 0 ? cp[0] : "",
                    name: values.company.label,
                    logo: cp && cp.length > 1 ? cp[1] : "",
                },
                location: values.location,
                salary: values.salary,
                quantity: values.quantity,
                level: values.level,
                description: value,
                startDate: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(
                    values.startDate
                )
                    ? dayjs(values.startDate, "DD/MM/YYYY").toDate()
                    : values.startDate,
                endDate: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.endDate)
                    ? dayjs(values.endDate, "DD/MM/YYYY").toDate()
                    : values.endDate,
                isActive: values.isActive,
            }

            const res = await callUpdateJob(job, dataUpdate._id)
            if (res.data) {
                message.success("Cập nhật job thành công")
                navigate("/admin/job")
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: res.message,
                })
            }
        } else {
            //create
            const cp = values?.company?.value?.split("@#$")
            const job = {
                name: values.name,
                skills: values.skills,
                company: {
                    _id: cp && cp.length > 0 ? cp[0] : "",
                    name: values.company.label,
                    logo: cp && cp.length > 1 ? cp[1] : "",
                },
                location: values.location,
                salary: values.salary,
                quantity: values.quantity,
                level: values.level,
                description: value,
                startDate: dayjs(values.startDate, "DD/MM/YYYY").toDate(),
                endDate: dayjs(values.endDate, "DD/MM/YYYY").toDate(),
                isActive: values.isActive,
            }

            const res = await callCreateJob(job)
            if (res.data) {
                message.success("Tạo mới việc làm thành công")
                navigate("/admin/job")
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: res.message,
                })
            }
        }
    }

    return (
        <div className={"bg-white p-2.5 px-7 rounded-md min-h-screen h-auto"}>
            <div className={"pt-2.5 pb-5"}>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: (
                                <Link to="/admin/job">Quản lý việc làm</Link>
                            ),
                        },
                        {
                            title: ` ${
                                dataUpdate?._id
                                    ? "Cập nhật việc làm"
                                    : "Tạo mới việc làm"
                            }`,
                        },
                    ]}
                />
            </div>
            <div>
                <ConfigProvider locale={enUS}>
                    <ProForm
                        form={form}
                        onFinish={onFinish}
                        submitter={{
                            searchConfig: {
                                resetText: "Hủy",
                                submitText: (
                                    <>
                                        {dataUpdate?._id
                                            ? "Cập nhật việc làm"
                                            : "Tạo mới việc làm"}
                                    </>
                                ),
                            },
                            onReset: () => navigate("/admin/job"),
                            // render: (_: any, dom: any) => (
                            //     <FooterToolbar>{dom}</FooterToolbar>
                            // ),
                            submitButtonProps: {
                                icon: <CheckSquareOutlined />,
                            },
                        }}
                    >
                        <Row gutter={[20, 20]}>
                            <Col span={24} md={12}>
                                <ProFormText
                                    label="Tên việc làm"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập tên việc làm",
                                        },
                                    ]}
                                    placeholder="Nhập tên việc làm"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="skills"
                                    label="Kỹ năng yêu cầu"
                                    options={SKILLS_LIST}
                                    placeholder="Vui lòng chọn kỹ năng yêu cầu"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn kỹ năng!",
                                        },
                                    ]}
                                    allowClear
                                    mode="multiple"
                                    fieldProps={{
                                        showArrow: false,
                                    }}
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="location"
                                    label="Địa điểm"
                                    options={LOCATION_LIST.filter(
                                        (item) => item.value !== "ALL"
                                    )}
                                    placeholder="Vui lòng chọn địa điểm"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn địa điểm!",
                                        },
                                    ]}
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormDigit
                                    label="Mức lương"
                                    name="salary"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập mức lương",
                                        },
                                    ]}
                                    placeholder="Nhập mức lương"
                                    fieldProps={{
                                        addonAfter: " đ",
                                        formatter: (value) =>
                                            `${value}`.replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ","
                                            ),
                                        parser: (value) =>
                                            +(value || "").replace(
                                                /\$\s?|(,*)/g,
                                                ""
                                            ),
                                    }}
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormDigit
                                    label="Số lượng"
                                    name="quantity"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập số lượng",
                                        },
                                    ]}
                                    placeholder="Nhập số lượng"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="level"
                                    label="Trình độ"
                                    valueEnum={{
                                        INTERN: "INTERN",
                                        FRESHER: "FRESHER",
                                        JUNIOR: "JUNIOR",
                                        MIDDLE: "MIDDLE",
                                        SENIOR: "SENIOR",
                                    }}
                                    placeholder="Vui lòng chọn trình độ"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn trình độ!",
                                        },
                                    ]}
                                />
                            </Col>

                            {(dataUpdate?._id || !id) && (
                                <Col span={24} md={6}>
                                    <ProForm.Item
                                        name="company"
                                        label="Thuộc Công Ty"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng chọn công ty!",
                                            },
                                        ]}
                                    >
                                        <DebounceSelect
                                            allowClear
                                            showSearch
                                            defaultValue={companies}
                                            value={companies}
                                            placeholder="Chọn công ty"
                                            fetchOptions={fetchCompanyList}
                                            onChange={(newValue: any) => {
                                                if (
                                                    newValue?.length === 0 ||
                                                    newValue?.length === 1
                                                ) {
                                                    setCompanies(
                                                        newValue as ICompanySelect[]
                                                    )
                                                }
                                            }}
                                            style={{ width: "100%" }}
                                            disabled={
                                                !!(
                                                    dataUpdate?._id &&
                                                    user?.role?.name === "HR"
                                                )
                                            }
                                        />
                                    </ProForm.Item>
                                </Col>
                            )}
                        </Row>
                        <Row gutter={[20, 20]}>
                            <Col span={24} md={6}>
                                <ProFormDatePicker
                                    label="Ngày bắt đầu"
                                    name="startDate"
                                    normalize={(value) =>
                                        value && dayjs(value, "DD/MM/YYYY")
                                    }
                                    fieldProps={{
                                        format: "DD/MM/YYYY",
                                        variant: "outlined",
                                    }}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn ngày cấp",
                                        },
                                    ]}
                                    placeholder="dd/mm/yyyy"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormDatePicker
                                    label="Ngày kết thúc"
                                    name="endDate"
                                    normalize={(value) =>
                                        value && dayjs(value, "DD/MM/YYYY")
                                    }
                                    fieldProps={{
                                        format: "DD/MM/YYYY",
                                        variant: "outlined",
                                    }}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn ngày cấp",
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                const startDate =
                                                    getFieldValue("startDate")
                                                if (
                                                    !value ||
                                                    !startDate ||
                                                    dayjs(value).isAfter(
                                                        dayjs(startDate)
                                                    )
                                                ) {
                                                    return Promise.resolve()
                                                }
                                                return Promise.reject(
                                                    new Error(
                                                        "Ngày kết thúc phải sau ngày bắt đầu"
                                                    )
                                                )
                                            },
                                        }),
                                    ]}
                                    placeholder="dd/mm/yyyy"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSwitch
                                    label="Trạng thái"
                                    name="isActive"
                                    checkedChildren="Đang hoạt động"
                                    unCheckedChildren="Không hoạt động"
                                    initialValue={true}
                                    fieldProps={{
                                        defaultChecked: true,
                                    }}
                                />
                            </Col>
                            <Col span={24}>
                                <ProForm.Item
                                    name="description"
                                    label="Miêu tả job"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập miêu tả job!",
                                        },
                                    ]}
                                >
                                    <ReactQuill
                                        theme="snow"
                                        value={value}
                                        onChange={setValue}
                                    />
                                </ProForm.Item>
                            </Col>
                        </Row>
                        <Divider />
                    </ProForm>
                </ConfigProvider>
            </div>
        </div>
    )
}

export default ViewUpsertJob
