import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { IJob } from "@/types/backend";
import { callFetchJobById } from "@/config/api";
import parse from "html-react-parser";
import { Col, Divider, Row, Skeleton, Tag, Button, Tooltip } from "antd";
import {
  DollarOutlined,
  EnvironmentOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { getLocationName } from "@/config/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ApplyModal from "@/components/client/modal/apply.modal";
import { useAppSelector } from "@/redux/hooks";
dayjs.extend(relativeTime);

const ClientJobDetailPage = (props: any) => {
  const user = useAppSelector((state) => state.account.user);
  const [jobDetail, setJobDetail] = useState<IJob | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const id = params?.get("id"); // job id
  const isDeadlinePassed = dayjs().isAfter(dayjs(jobDetail?.endDate));

  useEffect(() => {
    const init = async () => {
      if (id) {
        setIsLoading(true);
        const res = await callFetchJobById(id);
        if (res?.data) {
          setJobDetail(res.data);
        }
        setIsLoading(false);
      }
    };
    init();
  }, [id]);

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-lg">
      {isLoading ? (
        <Skeleton />
      ) : (
        <Row gutter={[20, 20]}>
          {jobDetail && jobDetail._id && (
            <>
              <Col
                span={24}
                className="bg-white max-w-[1230px] p-4 rounded-lg shadow-md mx-auto max-height-[100%] overflow"
              >
                <div className="flex flex-col items-center mb-4">
                  <img
                    alt="example"
                    src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${
                      jobDetail.company?.logo
                    }`}
                    className="object-contain w-48 h-48 rounded-md mb-4"
                  />
                  <div className="text-2xl font-bold text-center">
                    {jobDetail.name}
                  </div>
                </div>
                <div className="text-center mb-4">
                  {user?.role?.name !== "HR" && (
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-gradient-to-r from-[#222831] to-[#3A506B] text-white px-4 py-2 rounded-md h-[40px] w-[300px] shadow-md text-lg hover:from-[#3A506B] hover:to-[#222831]"
                      disabled={isDeadlinePassed}
                    >
                      {isDeadlinePassed
                        ? "Hết hạn ứng tuyển"
                        : "Ứng tuyển ngay"}
                    </Button>
                  )}
                </div>
                <Divider />
                <div className="mx-4">
                  <div className="flex flex-wrap mb-4">
                    <span className="font-semibold mr-2">Kỹ năng:</span>
                    {jobDetail?.skills?.map((item, index) => (
                      <Tag
                        key={`${index}-key`}
                        color="gold"
                        className="mb-2 mr-2"
                      >
                        {item}
                      </Tag>
                    ))}
                  </div>
                  <div className="flex items-center mb-2">
                    <DollarOutlined />
                    <Tooltip title={"Mức lương"}>
                      &nbsp;
                      {(jobDetail.salary + "")?.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      )}{" "}
                      đ
                    </Tooltip>
                  </div>
                  <div className="flex items-center mb-2">
                    <EnvironmentOutlined style={{ color: "#58aaab" }} />
                    <Tooltip title={"Địa chỉ làm việc"}>
                      &nbsp;
                      {getLocationName(jobDetail.location)}
                    </Tooltip>
                  </div>
                  <div className="flex items-center mb-2">
                    <HistoryOutlined />
                    <Tooltip title={"Thời gian ứng tuyển"}>
                      &nbsp;
                      {dayjs(jobDetail.startDate).format("DD/MM/YYYY")}-
                      {dayjs(jobDetail.endDate).format("DD/MM/YYYY")}
                    </Tooltip>
                  </div>
                  <Divider />
                  <div className="prose">{parse(jobDetail.description)}</div>
                </div>
              </Col>
            </>
          )}
        </Row>
      )}
      <ApplyModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        jobDetail={jobDetail}
      />
    </div>
  );
};

export default ClientJobDetailPage;
