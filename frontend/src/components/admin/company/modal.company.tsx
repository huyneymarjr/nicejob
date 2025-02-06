import {
  CheckSquareOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  FooterToolbar,
  ModalForm,
  ProCard,
  ProFormText,
  ProFormTextArea,
  ProForm,
} from "@ant-design/pro-components";
import {
  Col,
  ConfigProvider,
  Form,
  Modal,
  Row,
  Upload,
  message,
  notification,
} from "antd";
import "styles/reset.scss";
import { isMobile } from "react-device-detect";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import {
  callCreateCompany,
  callUpdateCompany,
  callUploadSingleFile,
} from "@/config/api";
import { ICompany } from "@/types/backend";
import { v4 as uuidv4 } from "uuid";
import enUS from "antd/lib/locale/en_US";

interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  dataInit?: ICompany | null;
  setDataInit: (v: any) => void;
  reloadTable: () => void;
}

interface ICompanyForm {
  name: string;
  address: string;
}

interface ICompanyLogo {
  name: string;
  uid: string;
}

const ModalCompany = (props: IProps) => {
  const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

  //modal animation
  const [animation, setAnimation] = useState<string>("open");

  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
  const [dataLogo, setDataLogo] = useState<ICompanyLogo[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const [value, setValue] = useState<string>("");
  const [form] = Form.useForm();

  useEffect(() => {
    if (dataInit?._id && dataInit?.description) {
      setValue(dataInit.description);
    }
  }, [dataInit]);

  const submitCompany = async (valuesForm: ICompanyForm) => {
    const { name, address } = valuesForm;

    const logoToUpload =
      dataLogo.length > 0 ? dataLogo[0].name : dataInit?.logo;

    if (!logoToUpload) {
      message.error("Vui lòng tải lên ảnh Logo");
      return;
    }

    if (dataInit?._id) {
      //update
      const res = await callUpdateCompany(
        dataInit._id,
        name,
        address,
        value,
        logoToUpload
      );
      if (res.data) {
        message.success("Cập nhật công ty thành công");
        handleReset();
        reloadTable();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    } else {
      //create
      const res = await callCreateCompany(name, address, value, logoToUpload);
      if (res.data) {
        message.success("Thêm mới công ty thành công");
        handleReset();
        reloadTable();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    }
  };

  const handleReset = async () => {
    form.resetFields();
    setValue("");
    setDataInit(null);

    //add animation when closing modal
    setAnimation("close");
    await new Promise((r) => setTimeout(r, 400));
    setOpenModal(false);
    setAnimation("open");
  };

  const handleRemoveFile = (file: any) => {
    setDataLogo([]);
  };

  const handlePreview = async (file: any) => {
    if (!file.originFileObj) {
      setPreviewImage(file.url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
      return;
    }
    getBase64(file.originFileObj, (url: string) => {
      setPreviewImage(url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
    });
  };

  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info: any) => {
    if (info.file.status === "uploading") {
      setLoadingUpload(true);
    }
    if (info.file.status === "done") {
      setLoadingUpload(false);
    }
    if (info.file.status === "error") {
      setLoadingUpload(false);
      message.error(
        info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file."
      );
    }
  };

  const handleUploadFileLogo = async ({ file, onSuccess, onError }: any) => {
    const res = await callUploadSingleFile(file, "company");
    if (res && res.data) {
      setDataLogo([
        {
          name: res.data.fileName,
          uid: uuidv4(),
        },
      ]);
      form.setFieldValue("logo", res.data.fileName);
      if (onSuccess) onSuccess("ok");
    } else {
      if (onError) {
        setDataLogo([]);
        const error = new Error(res.message);
        onError({ event: error });
      }
    }
  };

  return (
    <>
      {openModal && (
        <>
          <ModalForm
            title={
              <>{dataInit?._id ? "Cập nhật công ty" : "Tạo mới công ty"}</>
            }
            open={openModal}
            modalProps={{
              onCancel: () => {
                handleReset();
              },
              afterClose: () => handleReset(),
              destroyOnClose: true,
              width: isMobile ? "100%" : 900,
              footer: null,
              keyboard: false,
              maskClosable: false,
              className: `modal-company ${animation}`,
              rootClassName: `modal-company-root ${animation}`,
              centered: true,
            }}
            scrollToFirstError={true}
            preserve={false}
            form={form}
            onFinish={submitCompany}
            initialValues={dataInit?._id ? dataInit : {}}
            submitter={{
              // render: (_: any, dom: any) => (
              //     <FooterToolbar>{dom}</FooterToolbar>
              // ),
              submitButtonProps: {
                icon: <CheckSquareOutlined />,
              },
              searchConfig: {
                resetText: "Hủy",
                submitText: <>{dataInit?._id ? "Cập nhật" : "Tạo mới"}</>,
              },
            }}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Logo công ty"
                  name="logo"
                  valuePropName="file"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng upload logo công ty",
                    },
                  ]}
                >
                  <ConfigProvider locale={enUS}>
                    <Upload
                      name="logo"
                      listType="picture-card"
                      className="avatar-uploader"
                      maxCount={1}
                      multiple={false}
                      customRequest={handleUploadFileLogo}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                      onRemove={(file) => {
                        handleRemoveFile(file);
                        form.setFieldValue("logo", undefined);
                      }}
                      onPreview={handlePreview}
                      defaultFileList={
                        dataInit?._id
                          ? [
                              {
                                uid: uuidv4(),
                                name: dataInit?.logo ?? "",
                                status: "done",
                                url: `${
                                  import.meta.env.VITE_BACKEND_URL
                                }/images/company/${dataInit?.logo}`,
                              },
                            ]
                          : []
                      }
                    >
                      <div>
                        {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    </Upload>
                  </ConfigProvider>
                </Form.Item>
              </Col>
              <Col span={24}>
                <ProFormText
                  label="Tên công ty"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng không bỏ trống",
                    },
                  ]}
                  placeholder="Nhập tên công ty"

                />
              </Col>
              <Col span={24}>
                <ProFormText
                  label="Địa chỉ"
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng không bỏ trống",
                    },
                    
                  ]}
                  placeholder="Nhập địa chỉ công ty"
                />
              </Col>

              <ProCard
                title="Miêu tả"
                // subTitle="mô tả công ty"
                headStyle={{ color: "#d81921" }}
                style={{ marginBottom: 20 }}
                headerBordered
                size="small"
                bordered
              >
                <Col span={24}>
                  <ProForm.Item
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập miêu tả công ty",
                      },
                      {
                        min: 10,
                        message: "Miêu tả công ty phải có ít nhất 10 ký tự",
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
              </ProCard>
            </Row>
          </ModalForm>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={() => setPreviewOpen(false)}
            style={{ zIndex: 1500 }}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </>
      )}
    </>
  );
};

export default ModalCompany;
