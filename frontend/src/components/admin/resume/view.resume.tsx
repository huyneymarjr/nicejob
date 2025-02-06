import { callUpdateResumeStatus } from "@/config/api"
import { IResume } from "@/types/backend"
import {
    Badge,
    Button,
    Descriptions,
    Drawer,
    Form,
    Select,
    message,
    notification,
} from "antd"
import dayjs from "dayjs"
import { useState, useEffect } from "react"
import { FileOutlined } from '@ant-design/icons';
const { Option } = Select

interface IProps {
    onClose: (v: boolean) => void
    open: boolean
    dataInit: IResume | null | any
    setDataInit: (v: any) => void
    reloadTable: () => void
}
const ViewDetailResume = (props: IProps) => {
    const [isSubmit, setIsSubmit] = useState<boolean>(false)
    const { onClose, open, dataInit, setDataInit, reloadTable } = props
    const [form] = Form.useForm()

    const handleChangeStatus = async () => {
        setIsSubmit(true)

        const status = form.getFieldValue("status")
        const res = await callUpdateResumeStatus(dataInit?._id, status)
        if (res.data) {
            message.success("Cập nhật trạng thái hồ sơ thành công!")
            setDataInit(null)
            onClose(false)
            reloadTable()
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message,
            })
        }

        setIsSubmit(false)
    }

    useEffect(() => {
        if (dataInit) {
            form.setFieldValue("status", dataInit.status)
        }
        return () => form.resetFields()
    }, [dataInit])

    return (
        <>
            <Drawer
                title="Thông tin hồ sơ"
                placement="right"
                onClose={() => {
                    onClose(false)
                    setDataInit(null)
                }}
                open={open}
                width={"40vw"}
                maskClosable={false}
                destroyOnClose
                extra={
                    <Button
                        loading={isSubmit}
                        type="primary"
                        onClick={handleChangeStatus}
                    >
                        Thay đổi trạng thái
                    </Button>
                }
            >
                <Descriptions title="" bordered column={2} layout="vertical">
                    <Descriptions.Item label="Email">
                        {dataInit?.createdBy?.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Form form={form}>
                            <Form.Item name={"status"}>
                                <Select
                                    style={{ width: "100%" }}
                                    defaultValue={dataInit?.status}
                                >
                                    <Option value="PENDING">Đang chờ</Option>
                                    <Option value="REVIEWING">Đang xem xét</Option>
                                    <Option value="APPROVED">Đã duyệt</Option>
                                    <Option value="REJECTED">Từ chối</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên việc làm">
                        {dataInit?.jobId?.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên Công Ty">
                        {dataInit?.companyId?.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="CV Ứng viên" span={2}>
                        <Button 
                            type="link"
                            icon={<FileOutlined />}
                            onClick={() => {
                                if(dataInit?.url) {
                                    window.open(
                                        `${import.meta.env.VITE_BACKEND_URL}/images/resume/${dataInit.url}`,
                                        '_blank'
                                    );
                                }
                            }}
                        >
                            Chi tiết
                        </Button>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                        {dataInit && dataInit.createdAt
                            ? dayjs(dataInit.createdAt).format("DD-MM-YYYY HH:mm:ss")
                            : ""}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày sửa">
                        {dataInit && dataInit.updatedAt
                            ? dayjs(dataInit.updatedAt).format("DD-MM-YYYY HH:mm:ss")
                            : ""}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}

export default ViewDetailResume
